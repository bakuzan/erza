const { DataTypes } = require('sequelize');

const { Statuses } = require('../../constants/enums');

module.exports = function itemFields() {
  return {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    start: {
      type: DataTypes.DATE,
      allowNull: true
    },
    end: {
      type: DataTypes.DATE,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM,
      values: [...Statuses]
    },
    owned: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    rating: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    isAdult: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    isRepeat: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    timesCompleted: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    image: {
      type: DataTypes.STRING,
      defaultValue: ''
    },
    link: {
      type: DataTypes.STRING,
      defaultValue: ''
    },
    malId: {
      type: DataTypes.INTEGER,
      defaultValue: null,
      allowNull: true
    },
    series_start: {
      type: DataTypes.DATE,
      allowNull: true
    },
    series_end: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updatedAt: {
      type: DataTypes.DATE
    },
    createdAt: {
      type: DataTypes.DATE
    }
  };
};
