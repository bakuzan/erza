const chalk = require('chalk');
const Sequelize = require('sequelize');

const Constants = require('../constants');
const Utils = require('../utils');
const migrate = require('../config');

const db = new Sequelize(Constants.appName, null, null, {
  dialect: 'sqlite',
  storage: `${process.env.DB_STORAGE_PATH}${Constants.appName}.${
    process.env.NODE_ENV
  }.sqlite`,
  operatorsAliases: false
});

const AnimeModel = db.import('./anime');
const MangaModel = db.import('./manga');
const EpisodeModel = db.import('./episode');
const ChapterModel = db.import('./chapter');
const TagModel = db.import('./tag');

// Anime-Tag
AnimeModel.Tag = AnimeModel.hasMany(TagModel);
TagModel.Anime = TagModel.belongsToMany(AnimeModel);

// Anime-Episode
AnimeModel.Episode = AnimeModel.hasMany(EpisodeModel);
EpisodeModel.Anime = EpisodeModel.belongsTo(AnimeModel);

// Manga-Tag
MangaModel.Tag = MangaModel.hasMany(TagModel);
TagModel.Manga = TagModel.belongsToMany(MangaModel);

// Manga-Chapter
MangaModel.Chapter = MangaModel.hasMany(ChapterModel);
ChapterModel.Manga = ChapterModel.belongsTo(MangaModel);

// Sync and Migrate db
// Only add test data if sync is forced
// Populate rankings
const FORCE_DB_REBUILD = Utils.stringToBool(process.env.FORCE_DB_REBUILD);
const SEED_DB = Utils.stringToBool(process.env.SEED_DB);

db.sync({ force: FORCE_DB_REBUILD })
  .then(() => migrate(db))
  .then(async () => {
    if (FORCE_DB_REBUILD && SEED_DB) {
      console.log(chalk.greenBright('Seed Data Not Setup.'));
    }
  });

const {
  anime: Anime,
  manga: Manga,
  episode: Episode,
  chapter: Chapter,
  tag: Tag
} = db.models;

module.exports = {
  db,
  Anime,
  Manga,
  Episode,
  Chapter,
  Tag
};
