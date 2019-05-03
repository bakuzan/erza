const inSeasonCalc = require('../../utils/inSeason');
const { formatDateYYYYMM } = require('../../utils/formatDate');
const { padNumber } = require('../../utils');

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

module.exports = function groupingAndSorting({ partition, breakdown }) {
  const [year] = partition.split('-');
  return breakdown === StatBreakdown.Season
    ? [getSeason, orderSeasons, seasonOrder]
    : [
        getEndMonth,
        orderDates,
        Array(12)
          .fill(1)
          .map((n, i) => `${year}-${padNumber(n + i, 2)}`)
      ];
};
