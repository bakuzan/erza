const getAverage = require('./average');
const { getMaximum, getMinimum } = require('./minMax');
const getMode = require('./mode');

module.exports = function processRatingStatistics(key, values) {
  return {
    key,
    average: getAverage(values),
    highest: getMaximum(values),
    lowest: getMinimum(values),
    mode: getMode(values)
  };
};
