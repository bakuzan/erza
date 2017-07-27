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
	model.getGroupedCount("$status", 1, { isAdult: isAdult }, function(err, arr) {
		console.log(arr);
    res.jsonp(
			arr.map(({ _id, value }) => ({ key: getKeyByValue(Constants.status, _id), value }))
		);
  })
}

const getRatingCounts = (req, res) => {
	const { params: { type, isAdult } } = req;
  const model = getQueryModelForType(type);
	model.getGroupedCount("$rating", -1, { isAdult: isAdult }, function(err, arr) {
    res.jsonp(
			arr.map(({ _id, value }) => ({ key: `${_id}`, value }))
		);
  })
}

module.exports = {
	getStatusCounts,
	getRatingCounts
};
