const getSharedFields = require('./shared/historyFields');

module.exports = (db, Types) => {
  const sharedFields = getSharedFields(Types);

  return db.define('chapter', {
    ...sharedFields,
    chapter: {
      type: Types.INTEGER,
      allowNull: false
    }
  });
};
