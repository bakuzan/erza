const getSharedFields = require('./shared/historyFields');

module.exports = (db, Types) => {
  const sharedFields = getSharedFields(Types);

  return db.define('episode', {
    ...sharedFields,
    episode: {
      type: Types.INTEGER,
      allowNull: false
    }
  });
};
