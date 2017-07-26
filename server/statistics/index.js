const Constants = require('../constants');
const { handleErrorResponse } = require('../utils/common');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise; // mongoose mpromise is deprecated...so use native.



const getStatusCounts = (req, res) => {
	const { params: { type, isAdult } } = req;
	switch (type) {
		case Constants.type.anime: return animeStatusCounts(res, isAdult)
		case Constants.type.manga: return mangaStatusCounts(res, isAdult)
	}
}

const getRatingCounts = (req, res) => {
	const { params: { type, isAdult } } = req;
	switch (type) {
		case Constants.type.anime: return animeRatingCounts(res, isAdult)
		case Constants.type.manga: return mangaRatingCounts(res, isAdult)
	}
}

module.exports = {
	getStatusCounts,
	getRatingCounts
};
