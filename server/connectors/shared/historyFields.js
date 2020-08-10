const { DataTypes } = require('sequelize');

module.exports = function historyFields() {
  return {
    date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    rating: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    note: {
      type: DataTypes.STRING,
      defaultValue: '',
      allowNull: false
    }
  };
};
