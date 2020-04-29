const {
  Anime,
  Manga,
  Episode,
  Chapter,
  Tag,
  TodoTemplate,
  TodoInstance
} = require('../connectors');

const { mapAnime, mapManga } = require('./utils/mapSeries');
const {
  mapAnimeAndEpisode,
  mapMangaAndChapter
} = require('./utils/mapSeriesHistoryInputs');
const generateTodoInstances = require('../utils/generateTodoInstances');
const validateTodoTemplate = require('../utils/validateTodoTemplate');

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
  // Combined Series/History update
  async animeUpdateWithHistory(_, args, context) {
    return await context.updateSeriesWithHistory(
      {
        model: Anime,
        modelHistory: Episode
      },
      args,
      mapAnimeAndEpisode,
      mapAnime
    );
  },
  async mangaUpdateWithHistory(_, args, context) {
    return await context.updateSeriesWithHistory(
      {
        model: Manga,
        modelHistory: Chapter
      },
      args,
      mapMangaAndChapter,
      mapManga
    );
  },
  // Combind Series/Tag update/create
  async animeUpdateTags(_, args, context) {
    return await context.updateSeriesTags(Anime, args);
  },
  async mangaUpdateTags(_, args, context) {
    return await context.updateSeriesTags(Manga, args);
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
  },
  // Todo
  async todoCreate(_, { template }) {
    const validate = validateTodoTemplate(template);
    if (!validate.success) {
      return validate;
    }

    const todoInstances = generateTodoInstances(template);

    return await TodoTemplate.create(
      {
        ...template,
        todoInstances
      },
      { include: [TodoInstance] }
    )
      .then(() => ({ success: true, errorMessages: [] }))
      .catch((error) => ({ success: false, errorMessages: [error.message] }));
  },
  async todoUpdate(_, { todoTemplateId, template, isInstance }, context) {
    const validate = validateTodoTemplate(template);
    if (!validate.success) {
      return validate;
    }

    if (isInstance) {
      return await context.updateTodoInstance(template);
    } else {
      return await context.updateTodoTemplate(todoTemplateId, template);
    }
  },
  async todoTemplateRemove(_, { id }, context) {
    const deletedCount = await TodoTemplate.destroy({
      where: { id }
    });
    return context.handleDeleteResponse(id, deletedCount);
  },
  async todoRemove(_, { id, onlyInstance = true }, context) {
    if (onlyInstance) {
      const deletedCount = await TodoInstance.destroy({ where: { id } });
      return context.handleDeleteResponse(id, deletedCount);
    } else {
      const instance = await TodoInstance.findByPk(id, { raw: true });
      const deletedCount = await TodoTemplate.destroy({
        where: { id: instance.todoTemplateId }
      });
      return context.handleDeleteResponse(id, deletedCount);
    }
  }
};
