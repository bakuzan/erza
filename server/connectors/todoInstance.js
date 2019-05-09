module.exports = (db, Types) => {
  return db.define('todoInstance', {
    name: { type: Types.STRING, allowNull: false, unique: false },
    date: {
      type: Types.DATE,
      defaultValue: new Date().toISOString(),
      allowNull: false
    }
  });
};
