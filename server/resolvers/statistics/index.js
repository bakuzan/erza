const { db } = require('../../connectors');

const getBreakdownSettings = require('./getBreakdownSettings');
const fmtYYYYMM = require('./formatDateColumn');

// router.get(
//   '/api/statistics/history-detail/:type/:isAdult/:breakdown/:partition',
//   statistics.getHistoryCountsPartition
// );
// router.get(
//   '/api/statistics/history-years/:type/:isAdult/:breakdown/:partition',
//   statistics.getHistoryCountsByYearsPartition
// );

module.exports = {
  async statsStatusCounts(_, args, context) {
    return await context.Stats.counts(args, 'status', 'ASC');
  },
  async statsRatingCounts(_, args, context) {
    return await context.Stats.counts(args, 'rating', 'DESC');
  },
  async statsHistoryCounts(_, { type, isAdult, breakdown }, context) {
    const model = context.Stats.resolveModel(type);
    const opts = getBreakdownSettings(breakdown);

    const counts = await model.findAll({
      group: [fmtYYYYMM(opts.grouping)],
      where: {
        isAdult,
        ...opts.where
      },
      attributes: [
        [fmtYYYYMM(opts.grouping), 'key'],
        [db.fn('COUNT', db.col('id')), 'value']
      ],
      order: []
    });

    return counts;
  }
  // async statsHistoryCountsPartition(
  //   _,
  //   { type, isAdult, breakdown, partition }
  // ) {},
  // async statsHistoryCountsPartitionYear(
  //   _,
  //   { type, isAdult, breakdown, partition }
  // ) {}
};
