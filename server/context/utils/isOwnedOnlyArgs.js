const Op = require('sequelize').Op;

module.exports = function isOwnedOnlyArgs(isOwnedOnly) {
  if (isOwnedOnly) {
    return { owned: { [Op.eq]: true } };
  }

  return {};
};
