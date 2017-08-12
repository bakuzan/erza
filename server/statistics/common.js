const Constants = require('../constants.js');
const { padNumber } = require('../utils/common.js');

const fetchBreakdownObject = (v) => historyBreakdownIsMonths(v)
  ? { project: {}, match: {} }
  : {
      project: {
        monthMatches: { $eq: [{ $substr: ["$start", 0, 7] }, { $substr: ["$series_start", 0, 7] }] },
        monthPart: { $substr: ["$start", 5, 2] }
      },
      match: {
        $or: [
          { _legacyIsSeason: true },
          {
            $and: [
              { "monthMatches": true },
              { "series_type": { $in: Constants.seasonalTypes } },
              { "monthPart": { $in: ["01", "04", "07", "10"] } }
            ]
          }
        ]
      }
    };

const historyBreakdownIsMonths = val => val === Constants.breakdown.months;
const getDatePropertyString = b => historyBreakdownIsMonths(b) ? "$end" : "$start";

const aggregateIsSeasonStart = o => ["01", "04", "07", "10"].some(y => y === o._id.split("-")[1]);
const getSeasonStartMonth = month => Constants.seasonMonths[Math.floor(Number(month) / 4)];

const listOfMonths = (breakdown, partition) => {
  const isMonths = historyBreakdownIsMonths(breakdown);
  const [year,month] = partition.split("-");
  const monthNum = Number(month);
  return isMonths
    ? [partition]
    : [partition, `${year}-${padNumber(monthNum+1, 2)}`, `${year}-${padNumber(monthNum+2, 2)}`];
}

module.exports = {
  fetchBreakdownObject,
  historyBreakdownIsMonths,
  getDatePropertyString,
  aggregateIsSeasonStart,
  getSeasonStartMonth,
  listOfMonths
}
