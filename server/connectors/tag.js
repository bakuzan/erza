const { DataTypes } = require('sequelize');

module.exports = (db) => {
  return db.define('tag', {
    name: {
      type: DataTypes.STRING,
      defaultValue: '',
      unique: true,
      allowNull: false
    },
    isAdult: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  });
};
