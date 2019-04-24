const Constants = require('../constants');
const {
  padNumber,
  getDateParts,
  getPreviousMonth,
  getSeasonIndex
} = require('../utils');

const fetchStatusGrouping = (v) =>
  historyBreakdownIsMonths(v) ? 2 : { $in: [1, 2] };

const fetchBreakdownObject = (v) =>
  historyBreakdownIsMonths(v)
    ? { project: {}, match: {} }
    : {
        project: {
          monthMatches: {
            $eq: [
              { $substr: ['$start', 0, 7] },
              { $substr: ['$series_start', 0, 7] }
            ]
          },
          datesMatch: {
            $eq: [{ $substr: ['$start', 0, 7] }, { $substr: ['$end', 0, 7] }]
          },
          monthPart: { $substr: ['$start', 5, 2] }
        },
        match: {
          $or: [
            { _legacyIsSeason: true },
            {
              $and: [
                { monthMatches: true },
                { datesMatch: false },
                { series_type: { $in: Constants.seasonalTypes } }
                // { monthPart: { $in: ['01', '04', '07', '10'] } }
                /* Trial removal of "season start month check".
                 * Unsure as to what will happen.
                 */
              ]
            }
          ]
        }
      };

const historyBreakdownIsMonths = (val) => val === Constants.breakdown.months;

const getDatePropertyString = (b) =>
  historyBreakdownIsMonths(b) ? '$end' : '$start';

const aggregateIsSeasonStart = (o) =>
  ['01', '04', '07', '10'].some((y) => y === o._id.split('-')[1]);

const getSeasonStartMonthForCounts = (dateStr) => {
  const dateParts = getDateParts(dateStr);
  return getSeasonIndex(Constants.seasonMonths)(dateParts);
};

const getSeasonStartMonthForSeries = (year, month) => {
  const date = new Date(year, month, 1);
  const dateParts = getDateParts(date);
  return getSeasonIndex(Constants.seasonMonths)(dateParts);
};

const listOfMonths = (breakdown, partition) => {
  const isMonths = historyBreakdownIsMonths(breakdown);
  const [year, month] = partition.split('-');
  const monthNum = Number(month);
  return isMonths
    ? [partition]
    : [
        getPreviousMonth(year, monthNum),
        partition,
        `${year}-${padNumber(monthNum + 1, 2)}`
      ];
};

const buildNestedList = (arr) => {
  const first = arr[0];
  if (!first && first !== 0) {
    return [];
  }

  return [arr.filter((x) => x === first)].concat(
    buildNestedList(arr.filter((x) => x !== first))
  );
};

const getModeRating = (arr) => {
  const nested = buildNestedList(arr);
  const { number } = nested.reduce(
    (p, c) => {
      const length = c.length;
      if (length > p.length) {
        const number = c[0];

        return number ? { length, number } : p;
      }

      return p;
    },
    { length: 0, number: 0 }
  );
  return number;
};

const getAverageRating = (arr) => {
  const ratings = arr.filter((x) => !!x);
  if (!ratings.length) {
    return 0;
  }

  return ratings.reduce((p, c) => p + c) / ratings.length;
};

const emptyEpisodeStatistic = () => ({
  _id: '',
  average: 0.0,
  highest: 0,
  lowest: 0,
  mode: 0
});

module.exports = {
  emptyEpisodeStatistic,
  fetchStatusGrouping,
  fetchBreakdownObject,
  historyBreakdownIsMonths,
  getDatePropertyString,
  aggregateIsSeasonStart,
  getSeasonStartMonthForCounts,
  getSeasonStartMonthForSeries,
  listOfMonths,
  getModeRating,
  getAverageRating
};
