const { DataTypes } = require('sequelize');

const { MangaType, MangaTypes } = require('../constants/enums');
const getSharedFields = require('./shared/itemFields');

module.exports = (db) => {
  const sharedFields = getSharedFields();

  return db.define('manga', {
    ...sharedFields,
    chapter: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    volume: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    series_chapters: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    series_volumes: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    series_type: {
      type: DataTypes.ENUM,
      values: [...MangaTypes],
      defaultValue: MangaType.Unknown
    }
  });
};
