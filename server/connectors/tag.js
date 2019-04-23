module.exports = (db, Types) => {
  return db.define('tag', {
    name: {
      type: Types.STRING,
      defaultValue: '',
      unique: true,
      allowNull: false
    },
    isAdult: {
      type: Types.BOOLEAN,
      defaultValue: false
    }
  });
};
