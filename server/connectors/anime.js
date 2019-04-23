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
    _legacyIsSeason: {
      type: Types.BOOLEAN,
      defaultValue: false
    }
  });
};
