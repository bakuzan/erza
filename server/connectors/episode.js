const { DataTypes } = require('sequelize');

const getSharedFields = require('./shared/historyFields');

module.exports = (db) => {
  const sharedFields = getSharedFields();

  return db.define('episode', {
    ...sharedFields,
    episode: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });
};
