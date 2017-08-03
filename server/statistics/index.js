const Constants = require('../constants');
const { handleErrorResponse, getKeyByValue, stringToBool } = require('../utils/common');
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

const fetchRedactObject = (v) => historyBreakdownIsMonths(v) 
  ? {} 
  : { 
      $redact: { 
        $cond: { 
          if: { $or: [ { _legacyIsSeason: true }, { $eq: [{ $substr: ["$start", 0, 7] }, { $substr: ["$series_start", 0, 7] }] } ] },
		      then: "$$KEEP",
		      else: "$$PRUNE"
        }
      } 
  };

const historyBreakdownIsMonths = val => val === Constants.breakdown.months;
const getHistoryCounts = (req, res) => {
  const { params: { type, isAdult, breakdown } } = req;
  const model = getQueryModelForType(type);
  model.getGroupedCount({
    groupBy: "$month",
    sort: -1,
    match: { isAdult: stringToBool(isAdult) },
    project: { month: { $substr: ["$start", 0, 7] } },
	  redact: fetchRedactObject(breakdown)
  }).then(function(arr) {
    res.jsonp(
      currateHistoryBreakdown(breakdown, arr)
    );
  })
}

const currateHistoryBreakdown = (breakdown, arr) => {
  if (historyBreakdownIsMonths(breakdown)) return arr.map(({ _id, value }) => ({ key: `${_id}`, value }));
  
  // need to implement a method to turn months into seasons for this return
  return arr.map(({ _id, value }) => ({ key: `${_id}`, value }));
}

module.exports = {
	getStatusCounts,
	getRatingCounts,
	getHistoryCounts
};
