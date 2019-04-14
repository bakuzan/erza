const Common = require('../../utils');
const Constants = require('../../constants');

module.exports = function inSeasonCalc(item) {
  const { _legacyIsSeason, start, end, series_start, series_type } = item;
  const from = Common.getDateParts(start);
  const to = Common.getDateParts(end);
  const seriesStart = Common.getDateParts(series_start);
  const dateParts = seriesStart.month ? seriesStart : from;

  // check type
  const isValidType = Constants.seasonalTypes.indexOf(series_type) !== -1;

  // prevent 1 episode specials
  const noSingleEp = from.year !== to.year || from.month !== to.month;

  // years and month matches
  const matches =
    from.year === seriesStart.year && from.month === seriesStart.month;

  return {
    inSeason: _legacyIsSeason || (matches && noSingleEp && isValidType),
    year: from.year,
    season: Common.getSeasonText(dateParts)
  };
};
