const { padNumber } = require('../../utils');
const { fmtYYYY, fmtYYYYMM } = require('./formatDateColumn');
const isMonthBreakdown = require('./isMonthBreakdown');

module.exports = function getListPartitionsYear(breakdown, partition) {
  const isMonth = isMonthBreakdown(breakdown);

  if (isMonth) {
    return { fn: fmtYYYY, targetValues: [partition] };
  }

  const year = Number(partition);
  return {
    fn: fmtYYYYMM,
    targetValues: [
      `${year - 1}-12`,
      ...Array(11)
        .fill(1)
        .map((one, i) => `${year}-${padNumber(i + one, 2)}`)
    ]
  };
};
