const { DataTypes } = require('sequelize');

const { AnimeType, AnimeTypes } = require('../constants/enums');
const getSharedFields = require('./shared/itemFields');

module.exports = (db) => {
  const sharedFields = getSharedFields();

  return db.define('anime', {
    ...sharedFields,
    episode: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    series_episodes: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    series_type: {
      type: DataTypes.ENUM,
      values: [...AnimeTypes],
      defaultValue: AnimeType.Unknown
    },
    _legacyIsSeason: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  });
};
