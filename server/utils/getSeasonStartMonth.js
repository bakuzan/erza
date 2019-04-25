const Constants = require('../constants');
const { getDateParts, getSeasonIndex } = require('./');

module.exports = function getSeasonStartMonthForCounts(dateStr) {
  const dateParts = getDateParts(dateStr);
  return getSeasonIndex(Constants.seasonMonths)(dateParts);
};
