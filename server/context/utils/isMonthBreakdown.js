const { StatBreakdown } = require('../../constants/enums');

module.exports = function isMonthBreakdown(val) {
  return val === StatBreakdown.Month;
};
