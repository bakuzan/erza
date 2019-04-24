const Op = require('sequelize').Op;
const Constants = require('../../constants');

// router.get(
//   '/api/statistics/history-detail/:type/:isAdult/:breakdown/:partition',
//   statistics.getHistoryCountsPartition
// );
// router.get(
//   '/api/statistics/history-years/:type/:isAdult/:breakdown/:partition',
//   statistics.getHistoryCountsByYearsPartition
// );

const isMonthBreakdown = (val) => val === Constants.breakdown.months;

function getBreakdownSettings(v) {
  const isMonth = isMonthBreakdown(v);
  return {
    isMonth,
    grouping: isMonth ? 'end' : 'start',
    where: isMonth
      ? { status: 2 }
      : {
          status: { [Op.in]: [1, 2] },
          [Op.or]: [
            { _legacyIsSeason: true },
            {
              [Op.and]: [
                { start: { [Op.eq]: sequelize.col('series_start') } }, // start is in same month as series_start
                { start: { [Op.ne]: sequelize.col('end') } }, // start not in same month as end
                { series_type: { [Op.in]: Constants.seasonalTypes } }
              ]
            }
          ]
        }
  };
}

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
      group: [
        sequelize.fn('date_trunc', 'month', sequelize.col(opts.grouping))
      ],
      where: {
        isAdult,
        ...opts.where
      }
    });
  },
  async statsHistoryCountsPartition(
    _,
    { type, isAdult, breakdown, partition }
  ) {},
  async statsHistoryCountsPartitionYear(
    _,
    { type, isAdult, breakdown, partition }
  ) {}
};
