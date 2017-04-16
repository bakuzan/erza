const {getSchema} = require('@risingstack/graffiti-mongoose');

const fetchMe = require('./fetch.js');
const Common = require('../../utils/common.js');
const Query = require('./query');
const Anime = require('../../models/anime.js');

const options = {
  mutation: false, // mutation fields can be disabled
  allowMongoIDMutation: false // mutation of mongo _id can be enabled
};
const schema = getSchema([Anime], options);

const AnimeController = {
  getAllAnime: (req, res) => {
    return fetchMe(res, schema, Query.anime.getAll);
  },
  getAnimeById: (req, res) => {
    const { id } = req.params;
    return fetchMe(res, schema, Query.anime.getById(id));
  }
};

module.exports = AnimeController;
