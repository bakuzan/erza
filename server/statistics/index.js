const Constants = require('../constants');
const { handleErrorResponse, getKeyByValue, stringToBool } = require('../utils/common');
const Functions = require('./common.js');
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


const getHistoryCounts = (req, res) => {
  const { params: { type, isAdult, breakdown } } = req;
  const model = getQueryModelForType(type);
  const breakdownObj = Functions.fetchBreakdownObject(breakdown);
  model.getGroupedCount({
    groupBy: "$month",
    sort: -1,
    match: { isAdult: stringToBool(isAdult), status: 2 },
    project: Object.assign({}, { month: { $substr: [Functions.getDatePropertyString(breakdown), 0, 7] } }, breakdownObj.project),
    postMatch: breakdownObj.match
  }).then(function(arr) {
    res.jsonp(
      currateHistoryBreakdown(breakdown, arr)
    );
  })
}


const currateHistoryBreakdown = (breakdown, arr) => {
  if (Functions.historyBreakdownIsMonths(breakdown)) return arr.map(({ _id, value }) => ({ key: `${_id}`, value }));

  return arr
    .filter(x => !Functions.aggregateIsSeasonStart(x))
    .reduce((p, c) => {
      const {_id, value} = c;
      const [year, month] = _id.split("-");
      const seasonText = `${year}-${Functions.getSeasonStartMonth(month)}`;
      const index = p.findIndex(x => x._id === seasonText);

      if (index === -1) return [...p, { _id: seasonText, value }];
      const season = p[index];
      return Object.assign([...p], { [index]: { _id: season._id, value: season.value + value } });
    }, arr.filter(Functions.aggregateIsSeasonStart))
    .map(({ _id, value }) => ({ key: `${_id}`, value }));
}


const getHistoryCountsPartition = (req, res) => {
  const { params: { type, isAdult, breakdown, partition } } = req;
  const model = getQueryModelForType(type);
  const breakdownObj = Functions.fetchBreakdownObject(breakdown);
  model.getGroupedCount({
    groupBy: "$_id",
    sort: 1,
    match: { isAdult: stringToBool(isAdult), status: 2 },
    project: Object.assign({}, { month: { $substr: [Functions.getDatePropertyString(breakdown), 0, 7] } }, breakdownObj.project),
    postMatch: Object.assign({}, { $and: [{ month: { $in: Functions.listOfMonths(breakdown, partition) } }, breakdownObj.match] })
  }).then(function(arr) {
    const list = arr.map(({ _id }) => _id);
    return model.findIn(list);
  }).then(function(docs) {
    res.jsonp(docs);
  });
}


const getHistoryCountsByYears = (req, res) => {
  const { params: { type, isAdult, breakdown, partition } } = req;
  const model = getQueryModelForType(type);
  const breakdownObj = Functions.fetchBreakdownObject(breakdown);
  model.getGroupedCount({
    groupBy: "$month",
    sort: 1,
    match: { isAdult: stringToBool(isAdult), status: 2 },
    project: Object.assign({}, { year: { $substr: [Functions.getDatePropertyString(breakdown), 0, 4] }, month: { $substr: [Functions.getDatePropertyString(breakdown), 5, 2] } }, breakdownObj.project),
    postMatch: Object.assign({}, { year: { $in: [partition] } }, breakdownObj.match),
    grouping: { average: { $avg: "$rating" }, highest: { $max: "$rating" }, lowest: { $min: "$rating" }, ratings: { $push: "$rating" } }
  }).then(function(arr) {
	  const data = arr.map(item => {
		  const ratings = item.ratings.slice(0);
		  delete item.ratings;
		  return Object.assign({}, item, { 
		    mode: Functions.getModeRating(ratings)
		  });
	  });
	  res.jsonp(data);
  });
}


module.exports = {
	getStatusCounts,
	getRatingCounts,
	getHistoryCounts,
	getHistoryCountsPartition,
	getHistoryCountsByYears
};
