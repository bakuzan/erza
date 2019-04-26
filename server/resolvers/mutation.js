const { db, Anime, Manga, Episode, Chapter, Tag } = require('../connectors');

module.exports = {
  // Anime
  async animeCreate(_, { payload }, context) {
    return context.createSeries(Anime, payload, {
      mapBefore: () => null,
      mapAfter: () => null
    });
  },
  async animeRemove(_, args, context) {
    return await context.deleteEntity(Anime, args);
  },
  // Manga
  async mangaRemove(_, args, context) {
    return await context.deleteEntity(Manga, args);
  },
  // History
  async episodeUpdate(_, { id, ...args }, context) {
    return await context.updateEntity(Episode, args, id);
  },
  async episodeRemove(_, args, context) {
    return await context.deleteEntity(Episode, args);
  },
  async chapterUpdate(_, { id, ...args }, context) {
    return await context.updateEntity(Chapter, args, id);
  },
  async chapterRemove(_, args, context) {
    return await context.deleteEntity(Chapter, args);
  },
  // Tag
  async tagUpdate(_, { id, ...args }) {
    return await context.updateEntity(Tag, args, id);
  },
  async tagRemove(_, args, context) {
    return await context.deleteEntity(Tag, args);
  }
};
