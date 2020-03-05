const { seasonMonths } = require('../../constants');

module.exports = function(season) {
  const [year, month] = season.split('-');
  return /\d{4}/.test(year) && seasonMonths.includes(month);
};
