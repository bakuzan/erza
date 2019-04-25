const Op = require('sequelize').Op;

module.exports = function resolveWhereIn(list, key) {
  if (!list || list.length === 0) {
    return {};
  }

  return {
    [key]: {
      [Op.in]: list
    }
  };
};
