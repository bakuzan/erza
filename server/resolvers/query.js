const { Anime, Manga, Tag } = require('../connectors');

module.exports = {
  // Anime
  async animeById(_, { id }) {
    return await Anime.findByPk(id);
  },
  // Manga
  async mangaById(_, { id }) {
    return await Manga.findByPk(id);
  },
  // Tag
  async tagById(_, { id }) {
    return await Tag.findByPk(id);
  }
};
