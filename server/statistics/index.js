const Constants = require('../constants');
const { handleErrorResponse, getKeyByValue } = require('../utils/common');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise; // mongoose mpromise is deprecated...so use native.

const Anime = require('../models/anime.js').Anime;
const Manga = require('../models/manga.js').Manga;

const getQueryModelForType = t => t === Constants.type.anime ? Anime : Manga;


const getStatusCounts = (req, res) => {
	const { params: { type, isAdult } } = req;
  const model = getQueryModelForType(type);
	console.log(model);
  res.jsonp(
		model.getGroupedCount("status", 1, { isAdult }, (err, arr) => {
      return arr.map(({ _id, total }) => ({ key: getKeyByValue(Constants.status, _id), value: total }));
    })
	);
}

const getRatingCounts = (req, res) => {
	const { params: { type, isAdult } } = req;
  const model = getQueryModelForType(type);
	res.jsonp(
		model.getGroupedCount("rating", -1, { isAdult }, (err, arr) => {
      return arr.map(({ _id, total }) => ({ key: `${_id}`, value: total }));
    })
	);
}

module.exports = {
	getStatusCounts,
	getRatingCounts
};
