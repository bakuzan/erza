const Constants = require('../constants');
const {
  MAL_QUERY_TIMEOUT,
  fetchTimeout,
  handleErrorResponse
} = require('../utils/common');

const popura = require('popura');
const client = popura(process.env.MAL_USER, process.env.MAL_PASSWORD);

const removeNullOnEmpty = result => (result[0] === null ? [] : result);

const animeSearch = (res, search) => {
  fetchTimeout(MAL_QUERY_TIMEOUT, client.searchAnimes(search))
    .then(result => res.jsonp(removeNullOnEmpty(result)))
    .catch(err => handleErrorResponse(err, res));
};

const mangaSearch = (res, search) => {
  fetchTimeout(MAL_QUERY_TIMEOUT, client.searchMangas(search))
    .then(result => res.jsonp(removeNullOnEmpty(result)))
    .catch(err => handleErrorResponse(err, res));
};

const search = (req, res) => {
  const { params: { type }, query: { search } } = req;
  switch (type) {
    case Constants.type.anime:
      return animeSearch(res, search);
    case Constants.type.manga:
      return mangaSearch(res, search);
  }
};

module.exports = search;
