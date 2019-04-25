const { padNumber } = require('../../utils');
const getSeasonStartMonthForCounts = require('../../utils/getSeasonStartMonthForCounts');
const isMonthBreakdown = require('./isMonthBreakdown');

module.exports = function getListPartitions(breakdown, partition) {
  const isMonth = isMonthBreakdown(breakdown);

  if (isMonth) {
    return [partition];
  }

  const dStr = new Date(partition).toISOString();
  const [year] = dStr.split('-');
  const month = getSeasonStartMonthForCounts(dStr);
  const monthNum = Number(month);

  return [
    `${year}-${month}`,
    `${year}-${padNumber(monthNum + 1, 2)}`,
    `${year}-${padNumber(monthNum + 2, 2)}`
  ];
};
