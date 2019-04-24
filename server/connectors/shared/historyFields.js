module.exports = function historyFields(Types) {
  return {
    date: {
      type: Types.DATE,
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
    }
  };
};
