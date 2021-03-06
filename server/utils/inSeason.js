const { getDateParts } = require('./index');
const { getSeasonText } = require('./getSeasonStartMonth');
const { SeasonTypes } = require('../constants/enums');

module.exports = function inSeasonCalc(item) {
  const { _legacyIsSeason, start, end, series_start, series_type } = item;
  const from = getDateParts(start);
  const to = getDateParts(end);
  const seriesStart = getDateParts(series_start);
  const dateParts = seriesStart.month ? seriesStart : from;

  // check type
  const isValidType = SeasonTypes.indexOf(series_type) !== -1;

  // prevent 1 episode specials
  const noSingleEp = from.year !== to.year || from.month !== to.month;

  // years and month matches
  const matches =
    from.year === seriesStart.year && from.month === seriesStart.month;

  return {
    inSeason: _legacyIsSeason || (matches && noSingleEp && isValidType),
    ...getSeasonText(dateParts)
  };
};
