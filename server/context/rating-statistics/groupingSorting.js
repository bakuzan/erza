const inSeasonCalc = require('../../utils/inSeason');
const { formatDateYYYYMM } = require('../../utils/formatDate');

const { seasons } = require('../../constants');
const { StatBreakdown } = require('../../constants/enums');

const seasonOrder = Object.freeze(Object.keys(seasons).map((k) => seasons[k]));

// Groupers
const getSeason = (x) => inSeasonCalc(x).season;
const getEndMonth = (x) => formatDateYYYYMM(x.end);

// Sorters
const orderSeasons = (a, b) =>
  seasonOrder.findIndex((x) => x === a.key) -
  seasonOrder.findIndex((x) => x === b.key);

const orderDates = (a, b) => (a.key > b.key ? 1 : -1);

module.exports = function groupingAndSorting(breakdown) {
  return breakdown === StatBreakdown.Season
    ? [getSeason, orderSeasons]
    : [getEndMonth, orderDates];
};
