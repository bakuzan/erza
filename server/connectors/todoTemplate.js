const { RepeatPattern, RepeatPatterns } = require('../constants/enums');

module.exports = (db, Types) => {
  return db.define('todoTemplate', {
    name: { type: Types.STRING, allowNull: false, unique: false },
    date: {
      type: Types.DATE,
      defaultValue: new Date().toISOString(),
      allowNull: false
    },
    repeatPattern: {
      type: Types.ENUM,
      values: [...RepeatPattern],
      defaultValue: RepeatPatterns.None
    },
    repeatFor: {
      type: Types.INTEGER,
      defaultValue: 1,
      allowNull: false
    },
    repeatWeekDefinition: {
      type: Types.INTEGER,
      defaultValue: 1,
      allowNull: false
    }
  });
};
