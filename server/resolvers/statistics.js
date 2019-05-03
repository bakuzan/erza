const Op = require('sequelize').Op;

const { Anime } = require('../connectors');
const { Status, StatBreakdown } = require('../constants/enums');

module.exports = {
  async statsStatusCounts(_, args, context) {
    const counts = await context.Stats.counts(args, 'status', {
      sortDirection: 'ASC'
    });

    const ongoing = counts.find((x) => x.key === Status.Ongoing);
    return ongoing
      ? [ongoing, ...counts.filter((x) => x.key !== Status.Ongoing)]
      : counts;
  },
  async statsRatingCounts(_, args, context) {
    return await context.Stats.counts(args, 'rating', {
      sortDirection: 'DESC'
    });
  },
  async statsHistoryCounts(_, { breakdown, ...args }, context) {
    const opts = context.Stats.getBreakdownSettings(breakdown);

    return await context.Stats.counts(
      args,
      context.Stats.fmtYYYYMM(opts.grouping),
      opts
    );
  },
  async statsHistoryDetail(_, { partition, ...args }, context) {
    const targetValues = context.Stats.getListPartitions(
      args.breakdown,
      partition
    );

    return await context.Stats.historyDetail(args, {
      fn: context.Stats.fmtYYYYMM,
      comparator: {
        [Op.in]: targetValues
      }
    });
  },
  async statsHistoryDetailYear(_, { partition, ...args }, context) {
    const { fn, targetValues } = context.Stats.getListPartitionsYear(
      args.breakdown,
      partition
    );

    const series = await context.Stats.historyDetail(args, {
      fn,
      comparator: {
        [Op.in]: targetValues
      }
    });

    const summary = context.Stats.seriesStatistics(
      { partition, breakdown: args.breakdown },
      series
    );

    return {
      summary,
      series
    };
  },
  async currentSeason(_, { sorting }, context) {
    const [attr, direction] = context.Stats.validateSortOrder(
      ['average', 'DESC'],
      sorting
    );

    const series = await Anime.findAll({
      raw: true,
      attributes: context.Stats.seriesAttributes,
      where: {
        isAdult: { [Op.eq]: false },
        ...context.Stats.getSeasonalWhereClause([Status.Ongoing])
      }
    });

    const seriesIds = series.map((x) => x.id);
    const episodeStatistics = await context.Stats.episodeStatistics(
      StatBreakdown.Season,
      seriesIds
    );

    return series
      .map((x) => {
        const epStats = episodeStatistics.find((ep) => ep.key === x.id);
        return { ...x, ...epStats };
      })
      .sort((a, b) => {
        const aV = a[attr];
        const bV = b[attr];
        const offset = direction.toUpperCase() === 'ASC' ? 1 : -1;
        return (aV > bV ? 1 : aV < bV ? -1 : 0) * offset;
      });
  }
};
