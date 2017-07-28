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
  }, 
  function(err, arr) {
    console.log(arr);
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
  }, 
  function(err, arr) {
    res.jsonp(
      arr.map(({ _id, value }) => ({ key: `${_id}`, value }))
    );
  })
}

const getHistoryCounts = (req, res) => {
  const { params: { type, isAdult } } = req;
  const model = getQueryModelForType(type);
  model.getGroupedCount({ 
    groupBy: "$month", 
    sort: -1, 
    match: { isAdult: stringToBool(isAdult) }, 
    project: { month: { $substr: ["$start", 0, 7] } } 
  }, 
  function(err, arr) {
    res.jsonp(
      arr.map(({ _id, value }) => ({ key: `${_id}`, value }))
    );
  })
}

module.exports = {
	getStatusCounts,
	getRatingCounts,
  getHistoryCounts
};
