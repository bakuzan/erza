const { padNumber } = require('../../utils');
const { getSeasonStartMonth } = require('../../utils/getSeasonStartMonth');
const isMonthBreakdown = require('./isMonthBreakdown');

module.exports = function getListPartitions(breakdown, partition) {
  const isMonth = isMonthBreakdown(breakdown);

  if (isMonth) {
    return [partition];
  }

  const dStr = new Date(partition).toISOString();
  const { year, season: month } = getSeasonStartMonth(dStr);
  const monthNum = Number(month);

  const prevMonth = monthNum - 1 || 12; // Incase monthNum is 1
  const yearResolved = prevMonth !== 12 ? year : year - 1;

  return [
    `${yearResolved}-${padNumber(prevMonth, 2)}`,
    `${year}-${month}`,
    `${year}-${padNumber(monthNum + 1, 2)}`
  ];
};
