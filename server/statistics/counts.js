const Constants = require('../constants');
const { getKeyByValue, stringToBool } = require('../utils/common');
const Functions = require('./common.js');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise; // mongoose mpromise is deprecated...so use native.

const Anime = require('../models/anime.js').Anime;
const Manga = require('../models/manga.js').Manga;

const getQueryModelForType = t => (t === Constants.type.anime ? Anime : Manga);

const getStatusCounts = (req, res) => {
  const { params: { type, isAdult } } = req;
  const model = getQueryModelForType(type);
  model
    .getGroupedCount({
      groupBy: '$status',
      sort: 1,
      match: { isAdult: stringToBool(isAdult) }
    })
    .then(function(arr) {
      res.jsonp(
        arr.map(({ _id, value }) => ({
          key: getKeyByValue(Constants.status, _id),
          value
        }))
      );
    });
};

const getRatingCounts = (req, res) => {
  const { params: { type, isAdult } } = req;
  const model = getQueryModelForType(type);
  model
    .getGroupedCount({
      groupBy: '$rating',
      sort: -1,
      match: { isAdult: stringToBool(isAdult) }
    })
    .then(function(arr) {
      res.jsonp(arr.map(({ _id, value }) => ({ key: `${_id}`, value })));
    });
};

const getHistoryCounts = (req, res) => {
  const { params: { type, isAdult, breakdown } } = req;
  const model = getQueryModelForType(type);
  const breakdownObj = Functions.fetchBreakdownObject(breakdown);
  model
    .getGroupedCount({
      groupBy: '$month',
      sort: -1,
      match: {
        isAdult: stringToBool(isAdult),
        status: Functions.fetchStatusGrouping(breakdown)
      },
      project: Object.assign(
        {},
        {
          month: { $substr: [Functions.getDatePropertyString(breakdown), 0, 7] }
        },
        breakdownObj.project
      ),
      postMatch: breakdownObj.match,
      grouping: {
        dates: { $push: '$start' }
      }
    })
    .then(function(arr) {
      res.jsonp(currateHistoryBreakdown(breakdown, arr));
    });
};

const mapHistoryBreakdown = ({ _id, value }) => ({ key: `${_id}`, value });
const currateHistoryBreakdown = (breakdown, arr) => {
  if (Functions.historyBreakdownIsMonths(breakdown))
    return arr.map(({ _id, value }) => ({ key: `${_id}`, value }));

  const seasonStarts = arr.filter(Functions.aggregateIsSeasonStart);
  const additionalDates = arr
    .filter(x => !Functions.aggregateIsSeasonStart(x))
    .reduce((p, c) => [...p, ...c.dates], []);

  if (!additionalDates.length) return seasonStarts.map(mapHistoryBreakdown);

  return additionalDates
    .reduce((p, date) => {
      const dateString = new Date(date).toISOString();
      const year = dateString.substring(0, 4);
      const value = 1;
      const seasonText = `${year}-${Functions.getSeasonStartMonthForCounts(
        dateString
      )}`;
      const index = p.findIndex(x => x._id === seasonText);

      if (index === -1) return [...p, { _id: seasonText, value }];
      const season = p[index];
      return Object.assign([...p], {
        [index]: { _id: season._id, value: season.value + value }
      });
    }, seasonStarts)
    .map(mapHistoryBreakdown);
};

module.exports = {
  getStatusCounts,
  getRatingCounts,
  getHistoryCounts
};
