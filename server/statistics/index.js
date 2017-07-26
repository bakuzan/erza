const Constants = require('../constants');
const { handleErrorResponse } = require('../utils/common');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise; // mongoose mpromise is deprecated...so use native.

const Anime = require('../models/anime.js').Anime;
const Manga = require('../models/manga.js').Manga;

const getQueryModelForType = t => t === Constants.type.anime ? Anime : Manga;


const getStatusCounts = (req, res) => {
	const { params: { type, isAdult } } = req;
  const model = getQueryModelForType(type);
  
}

const getRatingCounts = (req, res) => {
	const { params: { type, isAdult } } = req;
  const model = getQueryModelForType(type);
  
}

module.exports = {
	getStatusCounts,
	getRatingCounts
};
