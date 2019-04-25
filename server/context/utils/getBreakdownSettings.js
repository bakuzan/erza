const Op = require('sequelize').Op;

const { db } = require('../../connectors');
const { Status } = require('../../constants/enums');

const isMonthBreakdown = require('./isMonthBreakdown');
const coalesceSeasonCounts = require('./coalesceSeasonCounts');
const getSeasonalWhereClause = require('./getSeasonalWhereClause');

module.exports = function getBreakdownSettings(v) {
  const isMonth = isMonthBreakdown(v);

  return {
    isMonth,
    mapper: isMonth ? (d) => d : coalesceSeasonCounts,
    grouping: isMonth ? 'end' : 'start',
    where: isMonth
      ? { status: Status.Completed }
      : getSeasonalWhereClause([Status.Ongoing, Status.Completed])
  };
};
