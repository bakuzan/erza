const { Statuses } = require('../../constants/enums');

module.exports = function itemFields(Types) {
  return {
    title: {
      type: Types.STRING,
      allowNull: false,
      unique: true
    },
    start: {
      type: Types.DATE,
      allowNull: true
    },
    end: {
      type: Types.DATE,
      allowNull: true
    },
    status: {
      type: Types.ENUM,
      values: [...Statuses]
    },
    owned: {
      type: Types.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    rating: {
      type: Types.INTEGER,
      defaultValue: 0
    },
    isAdult: {
      type: Types.BOOLEAN,
      defaultValue: false
    },
    isRepeat: {
      type: Types.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    timesCompleted: {
      type: Types.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    image: {
      type: Types.STRING,
      defaultValue: ''
    },
    link: {
      type: Types.STRING,
      defaultValue: ''
    },
    malId: {
      type: Types.INTEGER,
      defaultValue: null,
      allowNull: true
    },
    series_start: {
      type: Types.DATE,
      allowNull: true
    },
    series_end: {
      type: Types.DATE,
      allowNull: true
    },
    updatedAt: {
      type: Types.DATE
    },
    createdAt: {
      type: Types.DATE
    }
  };
};
