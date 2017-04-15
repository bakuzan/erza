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
  return month === 0 ? Constants.season.winter :
         month === 3 ? Constants.season.spring :
         month === 6 ? Constants.season.summer :
         month === 9 ? Constants.season.fall   :
         null;
}

const handleErrorResponse = (err, res) => {
  console.error(chalk.red(err));
  return res.status(400).send({ error: err });
}

const Common = {
  handleErrorResponse,
  getDateParts,
  getSeasonText
}

module.exports = Common;
