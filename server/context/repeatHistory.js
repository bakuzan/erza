const { db, Anime, Manga } = require('../connectors');
const SQL = require('../db-scripts');

const { StatType } = require('../constants/enums');
const chunk = require('../utils/chunk');

const getSeriesTotalParts = (isAnime, series) =>
  isAnime ? series.series_episodes : series.series_chapters;

module.exports = async function getRepeatHistory({ type, seriesId }) {
  const isAnime = type === StatType.Anime;
  const qk = isAnime ? 'get_repeatHistory_anime' : 'get_repeatHistory_manga';
  const model = isAnime ? Anime : Manga;

  const series = await model.findByPk(seriesId, { raw: true });
  if (series === null || (!series.isRepeat && series.timesCompleted < 1)) {
    // No possibility of a repeat.
    return {
      hasRepeats: false,
      items: [],
      seriesTotalParts: 0,
      timesCompleted: 0,
      warningMessages: []
    };
  }

  const isSingular = getSeriesTotalParts(isAnime, series) === 1;
  const results = await db.query(SQL[qk], {
    type: db.QueryTypes.SELECT,
    replacements: {
      seriesId
    }
  });

  const items = [];
  const warningMessages = [];
  const repeats = chunk(results, isSingular ? 1 : 2);
  const seriesTotalParts = results.length
    ? results[0].seriesTotalParts
    : series.series_episodes
    ? series.series_episodes
    : series.series_chapters;

  for (const group of repeats) {
    let [ending, beginning] = group;
    if (isSingular) {
      beginning = ending;
    }

    // For now, if we cannot create a repeat we will ignore it.
    if (!ending || !beginning) {
      continue;
    }

    items.push({
      repeatInstanceKey: `${beginning.repeatInstanceId}_${ending.repeatInstanceId}`,
      start: beginning.repeatInstanceNumber,
      startDate: beginning.repeatInstanceDate,
      end: ending.repeatInstanceNumber,
      endDate: ending.repeatInstanceDate,
      isCurrentRepeat:
        series.isRepeat &&
        items.length === 0 &&
        ending.repeatInstanceNumber !== seriesTotalParts
    });
  }

  const isFirstRepeat = series.isRepeat && items.length === 1;
  const hasMissingRecord = series.timesCompleted !== items.length;
  const missingCount = Math.max(1, series.timesCompleted - items.length);

  if (series.isRepeat) {
    warningMessages.push(`'${series.title}' is currently being repeated.`);
  }

  if (!isFirstRepeat && hasMissingRecord) {
    warningMessages.push(
      `Please be aware that '${series.title}' is missing ${missingCount} repeat records.`
    );
  }

  return {
    hasRepeats: true,
    items,
    statType: type,
    seriesId: series.id,
    seriesTitle: series.title,
    seriesTotalParts,
    timesCompleted: series.timesCompleted,
    warningMessages
  };
};
