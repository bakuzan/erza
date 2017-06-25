const chalk = require('chalk');
const Constants = require('../constants.js');

const getDateParts = (date) => {
  const d = new Date(date);
  return {
    year: d.getFullYear(),
    month: d.getMonth(),
    date: d.getDate()
  };
}

const getSeasonText = (month) => {
  return month === 0 ? Constants.seasons.winter :
         month === 3 ? Constants.seasons.spring :
         month === 6 ? Constants.seasons.summer :
         month === 9 ? Constants.seasons.fall   :
         null;
}

const handleErrorResponse = (err, res) => {
  console.error(chalk.bgRed.white.bold(err));
  const error = { error: err };
  return res ? res.status(400).send(error) : error;
}

const capitalise = str => str.charAt(0).toUpperCase() + str.slice(1);

const Common = {
  handleErrorResponse,
  getDateParts,
  getSeasonText,
  capitalise
}

module.exports = Common;
