const Constants = require('../constants');
const popura = require('popura');
const client = popura(process.env.MAL_USER, process.env.MAL_PASSWORD);

const removeNullOnEmpty = result => (result[0] === null) ? [] : result;

const animeSearch = (res, search) => {
		client.searchAnimes(search)
			.then(result => res.jsonp(removeNullOnEmpty(result)))
			.catch(err => err);
}

const mangaSearch = (res, search) => {
		client.searchMangas(search)
			.then(result => res.jsonp(removeNullOnEmpty(result)))
			.catch(err => err);
}

const search = (req, res) => {
	const { params: { type }, query: { search } } = req;
	switch (type) {
		case Constants.type.anime: return animeSearch(res, search)
		case Constants.type.manga: return mangaSearch(res, search)
	}
}

module.exports = search;
