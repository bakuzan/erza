const chalk = require('chalk');
const Sequelize = require('sequelize');

const Constants = require('../constants');
const Utils = require('../utils');
const migrate = require('../config');

const initialDataInsert = require('../config/initialDataInsert');
const extraSetup = require('./extraSetup');

const db = new Sequelize(Constants.appName, null, null, {
  dialect: 'sqlite',
  storage: `${process.env.DB_STORAGE_PATH}${Constants.appName}.${process.env.NODE_ENV}.sqlite`
});

const modelDefiners = [
  require('./anime'),
  require('./manga'),
  require('./episode'),
  require('./chapter'),
  require('./tag'),
  require('./todoTemplate'),
  require('./todoInstance')
];

// We define all models according to their files.
for (const modelDefiner of modelDefiners) {
  modelDefiner(db);
}

// Other db setup...
extraSetup(db);

// Sync and Migrate db
// Only add test data if sync is forced
// Populate rankings
const FORCE_DB_REBUILD = Utils.stringToBool(process.env.FORCE_DB_REBUILD);
const SEED_DB = Utils.stringToBool(process.env.SEED_DB);

db.sync({ force: FORCE_DB_REBUILD })
  .then(() => migrate(db))
  .then(async () => {
    if (FORCE_DB_REBUILD && SEED_DB) {
      console.log(chalk.greenBright('Migrating data files to SQLITE.'));
      await initialDataInsert(db);
    }
  });

const {
  anime: Anime,
  manga: Manga,
  episode: Episode,
  chapter: Chapter,
  tag: Tag,
  todoTemplate: TodoTemplate,
  todoInstance: TodoInstance
} = db.models;

module.exports = {
  db,
  Anime,
  Manga,
  Episode,
  Chapter,
  Tag,
  TodoTemplate,
  TodoInstance
};
