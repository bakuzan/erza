const { DataTypes } = require('sequelize');

const { RepeatPattern, RepeatPatterns } = require('../constants/enums');

module.exports = (db) => {
  return db.define('todoTemplate', {
    name: { type: DataTypes.STRING, allowNull: false, unique: false },
    date: {
      type: DataTypes.DATE,
      defaultValue: new Date().toISOString(),
      allowNull: false
    },
    repeatPattern: {
      type: DataTypes.ENUM,
      values: [...RepeatPattern],
      defaultValue: RepeatPatterns.None
    },
    repeatFor: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      allowNull: false
    },
    repeatWeekDefinition: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      allowNull: false
    }
  });
};
