const { DataTypes } = require('sequelize');

const getSharedFields = require('./shared/historyFields');

module.exports = (db) => {
  const sharedFields = getSharedFields();

  return db.define('chapter', {
    ...sharedFields,
    chapter: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });
};
