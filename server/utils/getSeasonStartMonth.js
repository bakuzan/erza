const Constants = require('../constants');
const { getDateParts, getSeasonIndex } = require('./');

module.exports = function getSeasonStartMonth(dateStr) {
  const dateParts = getDateParts(dateStr);
  return getSeasonIndex(Constants.seasonMonths)(dateParts);
};
