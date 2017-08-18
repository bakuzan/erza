const Constants = require('../constants');
const { handleErrorResponse, getKeyByValue, stringToBool } = require('../utils/common');
const Functions = require('./common.js');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise; // mongoose mpromise is deprecated...so use native.

const Anime = require('../models/anime.js').Anime;
const Manga = require('../models/manga.js').Manga;
const Episode = require('../models/episode.js').Episode;


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
    if (Functions.historyBreakdownIsMonths(breakdown)) return res.jsonp(docs);
    return attachEpisodeStatistics(res, { isAdult }, docs);
  });
}


const attachEpisodeStatistics = (res, { isAdult }, parents) => {
  const parentIds = parents.map(({ _id }) => _id);
  console.log(parentIds);
  Episode.getGroupedAggregation({
    groupBy: "$parent",
    sort: 1,
    match: { isAdult: stringToBool(isAdult), parent: { $in: parentIds } }
  }).then(function(arr) {
    const joined = parents.map(item => {
      const { _id, title, rating } = item;
      const parentId = _id.toString();
      const episodeStatistics = (arr.find(x => x._id.toString() === parentId) || {});
      const episodeRatings = (episodeStatistics.ratings || []).slice(0);
      delete episodeStatistics.ratings;

      const merged = Object.assign({}, {
        _id, 
        title,
        rating
      },
      {
        episodeStatistics: Object.assign({}, episodeStatistics, {
          mode: Functions.getModeRating(episodeRatings)
        })
      });
      console.log(merged);
      return merged;
    });

    res.jsonp(joined);
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
	  const data = fixSeasonalResults(breakdown, arr).map(item => {
		  const ratings = item.ratings.slice(0);
		  delete item.ratings;
		  return Object.assign({}, item, {
		    mode: Functions.getModeRating(ratings)
		  });
	  });
	  res.jsonp(data);
  });
}

const isASeasonStartMonth = obj => ["01", "04", "07", "10"].some(y => y === obj._id)
const fixSeasonalResults = (breakdown, data) => {
  if (Functions.historyBreakdownIsMonths(breakdown)) return data;

  return data
    .filter(x => !isASeasonStartMonth(x))
    .reduce((p, c) => {
      const {_id, value, average, highest, lowest, ratings} = c;
      const seasonNumber = `${Functions.getSeasonStartMonth(_id)}`;
      const index = p.findIndex(x => x._id === seasonNumber);

      if (index === -1) return [...p, { _id: seasonNumber, value, average, highest, lowest, ratings }];
      const season = p[index];
      const orderedArray = [...season.ratings, ...ratings].sort();
      const length = orderedArray.length;
      return Object.assign([...p], {
        [index]: {
          _id: season._id,
          value: season.value + value,
          average: orderedArray.reduce((p, c) => (p + c)) / length,
          highest: orderedArray[length - 1],
          lowest: orderedArray[0],
          ratings: orderedArray
        }
      });
    }, data.filter(isASeasonStartMonth))
}

module.exports = {
	getStatusCounts,
	getRatingCounts,
	getHistoryCounts,
	getHistoryCountsPartition,
	getHistoryCountsByYears
};
