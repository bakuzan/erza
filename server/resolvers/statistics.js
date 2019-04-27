const Op = require('sequelize').Op;

const { db, Anime } = require('../connectors');
const { Status, StatBreakdown } = require('../constants/enums');

module.exports = {
  async statsStatusCounts(_, args, context) {
    return await context.Stats.counts(args, 'status', { sortDirection: 'ASC' });
  },
  async statsRatingCounts(_, args, context) {
    return await context.Stats.counts(args, 'rating', {
      sortDirection: 'DESC'
    });
  },
  async statsHistoryCounts(_, { breakdown, ...args }, context) {
    const opts = context.Stats.getBreakdownSettings(breakdown);

    return await context.Stats.counts(args, fmtYYYYMM(opts.grouping), opts);
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
    return await context.Stats.historyDetail(args, {
      fn: context.Stats.fmtYYYY,
      comparator: {
        [Op.eq]: partition
      }
    });
  },
  async currentSeason(_, __, context) {
    const today = new Date();

    const series = await Anime.findAll({
      where: {
        isAdult: { [Op.eq]: false },
        ...context.Stats.getSeasonalWhereClause([Status.Ongoing])
      }
    });

    /** TODO
     *  Query episodes and aggregate to get rating -> avg, max, min, and mode
     */

    return series;
  }
};