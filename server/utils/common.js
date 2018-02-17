const chalk = require('chalk');
const Constants = require('../constants.js');

const getDateParts = date => {
  if (!date) return {};
  const d = new Date(date);
  return {
    year: d.getFullYear(),
    month: d.getMonth(),
    date: d.getDate()
  };
};

const getSeasonText = month => {
  return month < 3
    ? Constants.seasons.winter
    : month < 6
      ? Constants.seasons.spring
      : month < 9
        ? Constants.seasons.summer
        : month < 12 ? Constants.seasons.fall : null;
};

const handleErrorResponse = (err, res) => {
  console.error(chalk.bgRed.white.bold(err));
  const error = { success: false, error: err };
  return res ? res.status(400).send(error) : error;
};

const capitalise = str => str.charAt(0).toUpperCase() + str.slice(1);

const getKeyByValue = (o, v) => Object.keys(o).find(k => o[k] === v);

const stringToBool = s => s.toLowerCase() == 'true';

const padNumber = (n, width, z = 0) => {
  n += '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
};

const fetchTimeout = (t, promise) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error('fetch request timed out'));
    }, ms);
    promise.then(resolve, reject);
  });
};

const Common = {
  handleErrorResponse,
  getDateParts,
  getSeasonText,
  capitalise,
  getKeyByValue,
  stringToBool,
  padNumber,
  fetchTimeout
};

module.exports = Common;
