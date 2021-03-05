const { db, Anime, Manga } = require('../connectors');
const SQL = require('../db-scripts');

const { StatType } = require('../constants/enums');

module.exports = async function getRepeatHistory({ type, seriesId }) {
  const isAnime = type === StatType.Anime;
  const qk = isAnime ? 'get_repeatHistory_anime' : 'get_repeatHistory_manga';
  const model = isAnime ? Anime : Manga;

  const series = await model.findByPk(seriesId, { raw: true });
  if (series === null) {
    // error
  }

  if (!series.isRepeat && series.timesCompleted < 1) {
    // return empty
  }

  const results = await db.query(SQL[qk], {
    type: db.QueryTypes.SELECT,
    replacements: {
      seriesId
    }
  });

  /* TODO
   * Check history
   * Create Repeat Objects
   * Add Warning Messages
   * Add hasRepeatsFlag
   */
};
