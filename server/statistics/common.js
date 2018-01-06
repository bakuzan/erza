const Constants = require('../constants.js');
const { padNumber } = require('../utils/common.js');

const fetchStatusGrouping = v =>
  historyBreakdownIsMonths(v) ? 2 : { $in: [1, 2] };

const fetchBreakdownObject = v =>
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
          monthPart: { $substr: ['$start', 5, 2] }
        },
        match: {
          $or: [
            { _legacyIsSeason: true },
            {
              $and: [
                { monthMatches: true },
                { series_type: { $in: Constants.seasonalTypes } },
                { monthPart: { $in: ['01', '04', '07', '10'] } }
              ]
            }
          ]
        }
      };

const historyBreakdownIsMonths = val => val === Constants.breakdown.months;
const getDatePropertyString = b =>
  historyBreakdownIsMonths(b) ? '$end' : '$start';

const aggregateIsSeasonStart = o =>
  ['01', '04', '07', '10'].some(y => y === o._id.split('-')[1]);
const getSeasonStartMonth = month =>
  Constants.seasonMonths[Math.floor(Number(month) / 4)];

const listOfMonths = (breakdown, partition) => {
  const isMonths = historyBreakdownIsMonths(breakdown);
  const [year, month] = partition.split('-');
  const monthNum = Number(month);
  return isMonths
    ? [partition]
    : [
        partition,
        `${year}-${padNumber(monthNum + 1, 2)}`,
        `${year}-${padNumber(monthNum + 2, 2)}`
      ];
};

const buildNestedList = arr => {
  const first = arr[0];
  if (!first && first !== 0) return [];
  return [arr.filter(x => x === first)].concat(
    buildNestedList(arr.filter(x => x !== first))
  );
};

const getModeRating = arr => {
  const nested = buildNestedList(arr);
  const { number } = nested.reduce(
    (p, c) => {
      const length = c.length;
      return length > p.length ? { length, number: c[0] } : p;
    },
    { length: 0, number: 0 }
  );
  return number;
};

const getAverageRating = arr => {
  const ratings = arr.filter(x => !!x);
  return ratings.reduce((p, c) => p + c) / ratings.length;
};

module.exports = {
  fetchStatusGrouping,
  fetchBreakdownObject,
  historyBreakdownIsMonths,
  getDatePropertyString,
  aggregateIsSeasonStart,
  getSeasonStartMonth,
  listOfMonths,
  getModeRating,
  getAverageRating
};
