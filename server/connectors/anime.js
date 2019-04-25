const { AnimeType, AnimeTypes } = require('../constants/enums');

const getSharedFields = require('./shared/itemFields');

module.exports = (db, Types) => {
  const sharedFields = getSharedFields(Types);

  return db.define('anime', {
    ...sharedFields,
    episode: {
      type: Types.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    series_episodes: {
      type: Types.INTEGER,
      defaultValue: 0
    },
    series_type: {
      type: Types.ENUM,
      values: [...AnimeTypes],
      defaultValue: AnimeType.Unknown
    },
    _legacyIsSeason: {
      type: Types.BOOLEAN,
      defaultValue: false
    }
  });
};
