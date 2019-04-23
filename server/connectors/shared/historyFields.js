module.exports = function historyFields(Types) {
  return {
    date: {
      type: Types.DATE,
      defaultValue: Types.NOW,
      allowNull: false
    },
    rating: {
      type: Types.INTEGER,
      defaultValue: 0
    },
    note: {
      type: Types.STRING,
      defaultValue: '',
      allowNull: false
    },
    isAdult: {
      type: Types.BOOLEAN,
      defaultValue: false
    }
  };
};
