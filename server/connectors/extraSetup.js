module.exports = function applyExtraSetup(db) {
  const {
    anime: AnimeModel,
    manga: MangaModel,
    episode: EpisodeModel,
    chapter: ChapterModel,
    tag: TagModel,
    todoTemplate: TodoTemplateModel,
    todoInstance: TodoInstanceModel
  } = db.models;

  // Anime-Tag
  AnimeModel.Tag = AnimeModel.belongsToMany(TagModel, {
    through: 'AnimeTag'
  });
  TagModel.Anime = TagModel.belongsToMany(AnimeModel, {
    through: 'AnimeTag'
  });

  // Anime-Episode
  AnimeModel.Episode = AnimeModel.hasMany(EpisodeModel, {
    onDelete: 'cascade'
  });
  EpisodeModel.Anime = EpisodeModel.belongsTo(AnimeModel);

  // Manga-Tag
  MangaModel.Tag = MangaModel.belongsToMany(TagModel, {
    through: 'MangaTag'
  });
  TagModel.Manga = TagModel.belongsToMany(MangaModel, {
    through: 'MangaTag'
  });

  // Manga-Chapter
  MangaModel.Chapter = MangaModel.hasMany(ChapterModel, {
    onDelete: 'cascade'
  });
  ChapterModel.Manga = ChapterModel.belongsTo(MangaModel);

  // Todo
  TodoTemplateModel.TodoInstance = TodoTemplateModel.hasMany(
    TodoInstanceModel,
    {
      onDelete: 'cascade'
    }
  );
  TodoInstanceModel.TodoTemplate = TodoInstanceModel.belongsTo(
    TodoTemplateModel
  );
};
