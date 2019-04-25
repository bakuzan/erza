const { db, Anime, Manga, Episode, Chapter, Tag } = require('../connectors');

// async <entity>Create(){},
// async <entity>Update(){},

module.exports = {
  // Anime
  async animeRemove(_, args, context) {
    return await context.deleteEntity(Anime, args);
  },
  // Manga
  async mangaRemove(_, args, context) {
    return await context.deleteEntity(Manga, args);
  },
  // History
  async episodeRemove(_, args, context) {
    return await context.deleteEntity(Episode, args);
  },
  async chapterRemove(_, args, context) {
    return await context.deleteEntity(Chapter, args);
  },
  // Tag
  async tagRemove(_, args, context) {
    return await context.deleteEntity(Tag, args);
  }
};
