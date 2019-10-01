const { db, Anime, Manga } = require('../connectors');
const SQL = require('../db-scripts');

const { StatType, StatBreakdown } = require('../constants/enums');

const groupBy = require('../utils/groupBy');

const { fmtYYYYMM, fmtYYYY } = require('./utils/formatDateColumn');
const getBreakdownSettings = require('./utils/getBreakdownSettings');
const getListPartitions = require('./utils/getListPartitions');
const getListPartitionsYear = require('./utils/getListPartitionsYear');
const getSeasonalWhereClause = require('./utils/getSeasonalWhereClause');
const processRatingStatistics = require('./rating-statistics');
const getGroupingAndSortingFunctions = require('./rating-statistics/groupingSorting');
const validateSortOrder = require('./validators/validateSortOrder');

function resolveSeriesModel(t) {
  return t === StatType.Anime ? Anime : Manga;
}

function placeholderEpisodeStats() {
  return Object.freeze({
    season: '', // Populated by resolver
    average: -1.0,
    highest: -1,
    lowest: -1,
    mode: -1
  });
}

function seriesAttributes(type) {
  const extra = type === StatType.Anime ? ['_legacyIsSeason'] : [];
  return Object.freeze([
    'id',
    'title',
    'rating',
    'start',
    'end',
    'series_start',
    'series_type',
    ...extra
  ]);
}

module.exports = {
  fmtYYYYMM,
  fmtYYYY,
  getBreakdownSettings,
  getListPartitions,
  getListPartitionsYear,
  getSeasonalWhereClause,
  validateSortOrder,
  seriesAttributes,
  resolveSeriesModel,
  async counts({ type, isAdult }, column, opts = {}) {
    const model = resolveSeriesModel(type);
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
    const model = resolveSeriesModel(type);
    const opts = getBreakdownSettings(breakdown);

    const series = await model.findAll({
      raw: true,
      attributes: seriesAttributes(type),
      where: {
        isAdult,
        [opts.grouping]: db.where(
          groupOpts.fn(opts.grouping),
          groupOpts.comparator
        ),
        ...opts.where
      },
      order: [['title', 'ASC']]
    });

    const seriesIds = series.map((x) => x.id);

    const episodeStatistics = await this.episodeStatistics(
      breakdown,
      seriesIds
    );

    return series.map((x) => {
      const epStats =
        episodeStatistics.find((ep) => ep.key === x.id) ||
        placeholderEpisodeStats();

      return { ...x, ...epStats };
    });
  },
  async episodeStatistics(breakdown, seriesIds) {
    if (breakdown !== StatBreakdown.Season) {
      return [];
    }

    return await db.query(SQL['get_episode_statistics_v2'], {
      type: db.QueryTypes.SELECT,
      replacements: { seriesIds }
    });
  },
  seriesStatistics(args, series) {
    const [groupFn, sortFn, groupSource] = getGroupingAndSortingFunctions(args);
    const groupMap = groupBy(series, groupFn);

    return groupSource
      .reduce((p, k) => {
        const key = k;
        const list = groupMap[k] || [];
        return [...p, processRatingStatistics(key, list.map((x) => x.rating))];
      }, [])
      .sort(sortFn);
  },
  async tagStats({ type, isAdult }) {
    const qk =
      type === StatType.Anime ? 'get_tag_stats_anime' : 'get_tag_stats_manga';

    return await db.query(SQL[qk], {
      type: db.QueryTypes.SELECT,
      replacements: {
        isAdult
      }
    });
  }
};
