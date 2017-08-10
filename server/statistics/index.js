const Constants = require('../constants');
const { handleErrorResponse, getKeyByValue, stringToBool, padNumber } = require('../utils/common');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise; // mongoose mpromise is deprecated...so use native.

const Anime = require('../models/anime.js').Anime;
const Manga = require('../models/manga.js').Manga;

const getQueryModelForType = t => t === Constants.type.anime ? Anime : Manga;


const getStatusCounts = (req, res) => {
  const { params: { type, isAdult } } = req;
  const model = getQueryModelForType(type);
  model.getGroupedCount({
    groupBy: "$status",
    sort: 1,
    match: { isAdult: stringToBool(isAdult) }
  }).then(function(arr) {
    res.jsonp(
      arr.map(({ _id, value }) => ({ key: getKeyByValue(Constants.status, _id), value }))
    );
  })
}

const getRatingCounts = (req, res) => {
  const { params: { type, isAdult } } = req;
  const model = getQueryModelForType(type);
  model.getGroupedCount({
    groupBy: "$rating",
    sort: -1,
    match: { isAdult: stringToBool(isAdult) }
  }).then(function(arr) {
    res.jsonp(
      arr.map(({ _id, value }) => ({ key: `${_id}`, value }))
    );
  })
}

const fetchBreakdownObject = (v) => historyBreakdownIsMonths(v)
  ? { project: {}, match: {} }
  : {
      project: {
        monthMatches: { $eq: [{ $substr: ["$start", 0, 7] }, { $substr: ["$series_start", 0, 7] }] },
        monthPart: { $substr: ["$start", 5, 7] }
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
const getHistoryCounts = (req, res) => {
  const { params: { type, isAdult, breakdown } } = req;
  const model = getQueryModelForType(type);
  const breakdownObj = fetchBreakdownObject(breakdown);
  model.getGroupedCount({
    groupBy: "$month",
    sort: -1,
    match: { isAdult: stringToBool(isAdult), status: 2 },
    project: Object.assign({}, { month: { $substr: [getDatePropertyString(breakdown), 0, 7] } }, breakdownObj.project),
    postMatch: breakdownObj.match
  }).then(function(arr) {
    res.jsonp(
      currateHistoryBreakdown(breakdown, arr)
    );
  })
}

const aggregateIsSeasonStart = o => ["01", "04", "07", "10"].some(y => y === o._id.split("-")[1]);
const getSeasonStartMonth = month => Constants.seasonMonths[Math.floor(Number(month) / 4)];
const currateHistoryBreakdown = (breakdown, arr) => {
  if (historyBreakdownIsMonths(breakdown)) return arr.map(({ _id, value }) => ({ key: `${_id}`, value }));

  return arr
    .filter(x => !aggregateIsSeasonStart(x))
    .reduce((p, c) => {
      const {_id, value} = c;
      const [year, month] = _id.split("-");
      const seasonText = `${year}-${getSeasonStartMonth(month)}`;
      const index = p.findIndex(x => x._id === seasonText);

      if (index === -1) return [...p, { _id: seasonText, value }];
      const season = p[index];
      return Object.assign([...p], { [index]: { _id: season._id, value: season.value + value } });
    }, arr.filter(aggregateIsSeasonStart))
    .map(({ _id, value }) => ({ key: `${_id}`, value }));
}

const listOfMonths = (breakdown, partition) => {
  const isMonths = historyBreakdownIsMonths(breakdown);
  const [year,month] = partition.split("-");
  const monthNum = Number(month);
  return isMonths
    ? [partition]
    : [partition, `${year}-${padNumber(monthNum+1, 2)}`, `${year}-${padNumber(monthNum+2, 2)}`];
}
const getHistoryCountsPartition = (req, res) => {
  const { params: { type, isAdult, breakdown, partition } } = req;
  const model = getQueryModelForType(type);
  const breakdownObj = fetchBreakdownObject(breakdown);
  model.getGroupedCount({
    groupBy: "$_id",
    sort: 1,
    match: { isAdult: stringToBool(isAdult), status: 2 },
    project: Object.assign({}, { month: { $substr: [getDatePropertyString(breakdown), 0, 7] } }, breakdownObj.project),
    postMatch: Object.assign({}, { $and: [{ month: { $in: listOfMonths(breakdown, partition) } }, breakdownObj.match] })
  }).then(function(arr) {
    const list = arr.map(({ _id }) => _id);
    return model.findIn(list);
  }).then(function(docs) {
    res.jsonp(docs);
  });
}


module.exports = {
	getStatusCounts,
	getRatingCounts,
	getHistoryCounts,
  getHistoryCountsPartition
};
