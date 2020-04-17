const { db, Anime, Manga } = require('../connectors');
const SQL = require('../db-scripts');

const { StatType, StatBreakdown } = require('../constants/enums');

const groupBy = require('../utils/groupBy');
const dateRange = require('../utils/dateRange');
const { getLastDateOfMonth, isoDatePlusMonths } = require('../utils/isoDate');

const { fmtYYYYMM, fmtYYYY } = require('./utils/formatDateColumn');
const getBreakdownSettings = require('./utils/getBreakdownSettings');
const getListPartitions = require('./utils/getListPartitions');
const getListPartitionsYear = require('./utils/getListPartitionsYear');
const getSeasonalWhereClause = require('./utils/getSeasonalWhereClause');
const processRatingStatistics = require('./rating-statistics');
const getGroupingAndSortingFunctions = require('./rating-statistics/groupingSorting');
const validateSortOrder = require('./validators/validateSortOrder');
const validateSeason = require('./validators/validateSeason');
const SAE = require('./season-anime-episode');

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
      attributes: [
        [column, 'key'],
        [db.fn('COUNT', db.col('id')), 'value']
      ],
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
        return [
          ...p,
          processRatingStatistics(
            key,
            list.map((x) => x.rating)
          )
        ];
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
  },
  async tagGraph({ type, isAdult }) {
    const qk =
      type === StatType.Anime ? 'get_tag_graph_anime' : 'get_tag_graph_manga';

    const graphRows = await db.query(SQL[qk], {
      type: db.QueryTypes.SELECT,
      replacements: {
        isAdult
      }
    });

    const nodes = graphRows
      .filter((x) => x.id === x.relatedTagId)
      .map((x) => ({
        id: x.id,
        label: x.name,
        value: x.relatedLinkCount,
        title: `${x.name}: ${x.relatedLinkCount}`
      }));

    const edges = graphRows
      .filter((x) => x.id !== x.relatedTagId)
      .map((x) => ({
        from: x.id,
        to: x.relatedTagId,
        value: x.relatedLinkCount,
        title: `${x.name} - ${x.relatedTagName}: ${x.relatedLinkCount}`
      }));

    return { nodes, edges };
  },
  async animeSeasonEpisodes(season) {
    const result = validateSeason(season);

    if (!result) {
      throw new Error(
        `Invalid season format. Expect: "YYYY-MM", where MM is 01, 04, 07 or 10.`
      );
    }

    const initDate = `${season}-01`;
    const [start, end] = dateRange(
      initDate,
      getLastDateOfMonth(isoDatePlusMonths(initDate, 2))
    );

    const items = await db.query(SQL['get_anime_episodes_for_season'], {
      type: db.QueryTypes.SELECT,
      replacements: { start, end }
    });

    const results = items.reduce(
      (p, row) => {
        p.series.push(SAE.mapToSeries(row));
        p.episodes.push(SAE.mapToEpisode(row));
        return p;
      },
      {
        series: [],
        episodes: []
      }
    );

    const series = results.series.filter(
      (x, i, a) => a.findIndex((y) => y.id === x.id) === i
    );

    return {
      episodeCount: results.episodes.length,
      seriesCount: series.length,
      season,
      series,
      episodes: results.episodes
    };
  }
};
