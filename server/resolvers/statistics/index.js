const { db, Anime } = require('../../connectors');

const { Status, StatBreakdown } = require('../../constants/enums');
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
      raw: true,
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

    return opts.mapper(counts);
  },
  // async statsHistoryCountsPartition(
  //   _,
  //   { type, isAdult, breakdown, partition }
  // ) {},
  // async statsHistoryCountsPartitionYear(
  //   _,
  //   { type, isAdult, breakdown, partition }
  // ) {}
  async currentSeason() {
    const today = new Date();
    const seasonMonths = getListPartitions(StatBreakdown.Season, today);
    // TODO get stats avg,max,min,mode
    const series = await Anime.findAll({
      where: {
        isAdult: { [Op.eq]: false },
        status: { [Op.eq]: Status.Ongoing },
        start: db.where(fmtYYYYMM('start'), {
          [Op.in]: seasonMonths
        })
      }
    });
    console.log('SEASON MONTHS', seasonMonths);
    console.log('SEASON SERIES', series);
    return series;
  }
};
