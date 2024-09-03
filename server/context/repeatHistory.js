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

  for (const group of repeats.reverse()) {
    let [beg, end] = group;
    if (isSingular) {
      end = beg;
    }

    // For now, if we cannot create a repeat we will ignore it.
    if (!end || !beg) {
      continue;
    }

    const pairs = [];
    const numsMatch =
      beg.repeatInstanceNumber === end.repeatInstanceNumber ||
      beg.repeatInstanceNumber > end.repeatInstanceNumber;

    // Some series have a rewatch that consists of re-watching
    // a single episode from a plurality of episodes, therefore...
    if (!isSingular && numsMatch) {
      pairs.push([end, end]);
      pairs.push([beg, beg]);
    } else {
      pairs.push([beg, end]);
    }

    for (let [bg, eg] of pairs) {
      items.push({
        repeatInstanceKey: `${bg.repeatInstanceId}_${eg.repeatInstanceId}`,
        start: bg.repeatInstanceNumber,
        startDate: bg.repeatInstanceDate,
        end: eg.repeatInstanceNumber,
        endDate: eg.repeatInstanceDate,
        isCurrentRepeat:
          series.isRepeat &&
          items.length === 0 &&
          eg.repeatInstanceNumber !== seriesTotalParts
      });
    }
  }

  const isFirstRepeat = series.isRepeat && items.length === 1;
  const hasMissingRecord = series.isRepeat
    ? series.timesCompleted !== Math.max(items.length - 1, 0)
    : series.timesCompleted !== items.length;

  if (series.isRepeat) {
    warningMessages.push(`'${series.title}' is currently being repeated.`);
  }

  if (!isFirstRepeat && hasMissingRecord) {
    const missingCount = Math.max(1, series.timesCompleted - items.length);
    warningMessages.push(
      `Please be aware that '${series.title}' is missing ${missingCount} repeat history records.`
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
