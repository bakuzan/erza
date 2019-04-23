const getSharedFields = require('./shared/itemFields');

module.exports = (db, Types) => {
  const sharedFields = getSharedFields(Types);

  return db.define('manga', {
    ...sharedFields,
    chapter: {
      type: Types.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    volume: {
      type: Types.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    series_chapters: {
      type: Types.INTEGER,
      defaultValue: 0
    },
    series_volumes: {
      type: Types.INTEGER,
      defaultValue: 0
    }
  });
};
