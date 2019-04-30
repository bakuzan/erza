const Constants = require('../constants');
const { getDateParts } = require('./');

const getSeasonIndex = (seasonArr) => (dateParts) => {
  if (!dateParts) {
    return null;
  }

  const { month } = dateParts;
  if (!month && isNaN(month)) {
    return null;
  }

  const isLateInMonth = dateParts.date > 14;
  const modulus = dateParts.month % 3;
  const monthAdjusted =
    modulus === 2 || (modulus === 1 && isLateInMonth) ? month + 1 : month;

  const isThisYear = monthAdjusted < 12;
  const season =
    monthAdjusted < 3
      ? seasonArr[0]
      : monthAdjusted < 6
      ? seasonArr[1]
      : monthAdjusted < 9
      ? seasonArr[2]
      : isThisYear
      ? seasonArr[3]
      : seasonArr[0];

  return { season, year: isThisYear ? dateParts.year : dateParts.year + 1 };
};

const getSeasonText = getSeasonIndex(Object.values(Constants.seasons));

function getSeasonStartMonth(dateStr) {
  const dateParts = getDateParts(dateStr);
  return getSeasonIndex(Constants.seasonMonths)(dateParts);
}

module.exports = {
  getSeasonText,
  getSeasonStartMonth
};
