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

  // Anime-Anime Relations
  AnimeModel.AnimeRelation1 = AnimeModel.belongsToMany(AnimeModel, {
    as: 'FirstRelation',
    through: 'AnimeAnimeRelation',
    foreignKey: 'animeId1'
  });
  AnimeModel.AnimeRelation2 = AnimeModel.belongsToMany(AnimeModel, {
    as: 'SecondRelation',
    through: 'AnimeAnimeRelation',
    foreignKey: 'animeId2'
  });

  // Manga-Manga Relation
  MangaModel.MangaRelation1 = MangaModel.belongsToMany(MangaModel, {
    as: 'FirstRelation',
    through: 'MangaMangaRelation',
    foreignKey: 'mangaId1'
  });
  MangaModel.MangaRelation2 = MangaModel.belongsToMany(MangaModel, {
    as: 'SecondRelation',
    through: 'MangaMangaRelation',
    foreignKey: 'mangaId2'
  });

  // Anime-Manga Relation
  AnimeModel.MangaRelation = AnimeModel.belongsToMany(MangaModel, {
    through: 'AnimeMangaRelation'
  });
  MangaModel.AnimeRelation = MangaModel.belongsToMany(AnimeModel, {
    through: 'AnimeMangaRelation'
  });

  // Todo
  TodoTemplateModel.TodoInstance = TodoTemplateModel.hasMany(
    TodoInstanceModel,
    {
      onDelete: 'cascade'
    }
  );
  TodoInstanceModel.TodoTemplate =
    TodoInstanceModel.belongsTo(TodoTemplateModel);
};
