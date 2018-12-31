const chalk = require('chalk');
const Constants = require('../constants.js');

function getPreviousMonth(year, month) {
  // -2 because e.g. april(04), needs to be last month (-1) and adjusted for date month (-1)
  const date = getFormattedDateString(new Date(year, Number(month) - 2, 1));
  return date.substring(0, 7);
}

const getDateParts = (date) => {
  if (!date) return {};
  const d = new Date(date);
  return {
    year: d.getFullYear(),
    month: d.getMonth(),
    date: d.getDate()
  };
};

const getFormattedDateString = (d) => {
  const { year, month, date } = getDateParts(d);
  return `${year}-${padNumber(month + 1, 2)}-${padNumber(date, 2)}`;
};

const getSeasonIndex = (seasonArr) => (dateParts) => {
  if (!dateParts) return null;
  const { month } = dateParts;
  if (!month && isNaN(month)) return null;

  const isLateInMonth = dateParts.date > 14;
  const modulus = dateParts.month % 3;
  const monthAdjusted =
    modulus === 2 || (modulus === 1 && isLateInMonth) ? month + 1 : month;
  return monthAdjusted < 3
    ? seasonArr[0]
    : monthAdjusted < 6
      ? seasonArr[1]
      : monthAdjusted < 9
        ? seasonArr[2]
        : monthAdjusted < 12 ? seasonArr[3] : seasonArr[0];
};

const getSeasonText = getSeasonIndex(Object.values(Constants.seasons));

const handleErrorResponse = (err, res) => {
  console.error(chalk.bgRed.white.bold(err));
  const error = { success: false, error: err };
  return res ? res.status(400).send(error) : error;
};

const capitalise = (str) => str.charAt(0).toUpperCase() + str.slice(1);

const getKeyByValue = (o, v) => Object.keys(o).find((k) => o[k] === v);

const stringToBool = (s) => s.toLowerCase() == 'true';

const padNumber = (n, width, z = 0) => {
  n += '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
};

const MAL_QUERY_TIMEOUT = 5000;
const MAL_UPDATE_TIMEOUT = 5000;
const fetchTimeout = (t, promise) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error('fetch request timed out'));
    }, t);
    promise.then(resolve, reject);
  });
};

function sortNumbers(a, b) {
  return a - b;
}

const Common = {
  handleErrorResponse,
  getPreviousMonth,
  getDateParts,
  getFormattedDateString,
  getSeasonIndex,
  getSeasonText,
  capitalise,
  getKeyByValue,
  stringToBool,
  padNumber,
  fetchTimeout,
  MAL_QUERY_TIMEOUT,
  MAL_UPDATE_TIMEOUT,
  sortNumbers
};

module.exports = Common;
