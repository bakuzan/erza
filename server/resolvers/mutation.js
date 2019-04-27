const { Anime, Manga, Episode, Chapter, Tag } = require('../connectors');

const { mapAnime, mapManga } = require('./utils/mapSeries');

module.exports = {
  // Anime
  async animeCreate(_, { payload }, context) {
    return context.createSeries(Anime, payload, mapAnime);
  },
  async animeUpdate(_, { payload }, context) {
    return context.updateSeries(Anime, payload, mapAnime);
  },
  async animeRemove(_, args, context) {
    return await context.deleteEntity(Anime, args);
  },
  // Manga
  async mangaCreate(_, { payload }, context) {
    return context.createSeries(Manga, payload, mapManga);
  },
  async mangaUpdate(_, { payload }, context) {
    return context.updateSeries(Manga, payload, mapManga);
  },
  async mangaRemove(_, args, context) {
    return await context.deleteEntity(Manga, args);
  },
  // History
  async episodeUpdate(_, { payload }, context) {
    const { id, ...args } = payload;
    return await context.updateEntity(Episode, args, id);
  },
  async episodeRemove(_, args, context) {
    return await context.deleteEntity(Episode, args);
  },
  async chapterUpdate(_, { payload }, context) {
    const { id, ...args } = payload;
    return await context.updateEntity(Chapter, args, id);
  },
  async chapterRemove(_, args, context) {
    return await context.deleteEntity(Chapter, args);
  },
  // Tag
  async tagUpdate(_, { payload }, context) {
    const { id, ...args } = payload;
    return await context.updateEntity(Tag, args, id);
  },
  async tagRemove(_, args, context) {
    return await context.deleteEntity(Tag, args);
  }
};
