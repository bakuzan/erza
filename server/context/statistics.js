const { db, Anime, Manga } = require('../connectors');

const { StatType, Status, StatBreakdown } = require('../constants/enums');

const { fmtYYYYMM, fmtYYYY } = require('./utils/formatDateColumn');
const getBreakdownSettings = require('./utils/getBreakdownSettings');
const getListPartitions = require('./utils/getListPartitions');
const getSeasonalWhereClause = require('./utils/getSeasonalWhereClause');

function resolveModel(t) {
  return t === StatType.Anime ? Anime : Manga;
}

module.exports = {
  fmtYYYYMM,
  fmtYYYY,
  getBreakdownSettings,
  getListPartitions,
  getSeasonalWhereClause,
  async counts({ type, isAdult }, column, opts = {}) {
    const model = resolveModel(type);
    const where = opts.where || {};

    const counts = await model.findAll({
      raw: true,
      group: column,
      where: { isAdult, ...where },
      attributes: [[column, 'key'], [db.fn('COUNT', db.col('id')), 'value']],
      order: opts.sortDirection ? [[column, opts.sortDirection]] : undefined
    });

    return opts.mapper
      ? opts.mapper(counts)
      : counts.map((x) => ({ ...x, key: `${x.key}` }));
  },
  async historyDetail({ type, isAdult, breakdown }, groupOpts) {
    const model = resolveModel(type);
    const opts = getBreakdownSettings(breakdown);

    const series = await model.findAll({
      where: {
        isAdult,
        [opts.grouping]: db.where(
          groupOpts.fn(opts.grouping),
          groupOpts.comparator
        ),
        ...opts.where
      }
    });

    console.log('HISTORY', series.length);

    /** TODO for breakdown === Season
     *  Query episodes and aggregate to get rating -> avg, max, min, and mode
     */

    return series;
  }
};
