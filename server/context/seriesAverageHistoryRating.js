const { db } = require('../connectors');
const SQL = require('../db-scripts');

module.exports = async function seriesAverageHistoryRating(model, seriesId) {
  if (!seriesId) {
    return null;
  }

  const historyName = model.getTableName();
  const isEpisode = historyName === 'episodes';
  const queryKey = isEpisode
    ? 'get_series_episode_average_rating'
    : 'get_series_chapter_average_rating';

  const results = await db.query(SQL[queryKey], {
    type: db.QueryTypes.SELECT,
    replacements: { seriesId }
  });

  return results.pop();
};
