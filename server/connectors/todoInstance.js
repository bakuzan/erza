const { DataTypes } = require('sequelize');

module.exports = (db) => {
  return db.define('todoInstance', {
    name: { type: DataTypes.STRING, allowNull: false, unique: false },
    date: {
      type: DataTypes.DATE,
      defaultValue: new Date().toISOString(),
      allowNull: false
    }
  });
};
