const { RepeatPatterns } = require('../constants/enums');
const {
  isoDate,
  isoDatePlusDays,
  isoDatePlusMonths,
  isoDatePlusYears
} = require('./isoDate');

function mapTemplateToInstance(t, date = null) {
  const todoTemplateId = t.hasOwnProperty('id') ? t.id : undefined;
  return {
    name: t.name,
    date: isoDate(date || t.date),
    todoTemplateId
  };
}

module.exports = function generateTodoInstances(template) {
  const pattern = template.repeatPattern;
  if (pattern === RepeatPatterns.None) {
    return [mapTemplateToInstance(template)];
  }

  let calcDateOffset = null;

  switch (pattern) {
    case RepeatPatterns.Daily:
      calcDateOffset = (d, i) => isoDatePlusDays(d, i);
      break;
    case RepeatPatterns.Weekly:
      calcDateOffset = (d, i) =>
        isoDatePlusDays(d, i * 7 * template.repeatWeekDefinition);
      break;
    case RepeatPatterns.Monthly:
      calcDateOffset = (d, i) => isoDatePlusMonths(d, i);
      break;
    case RepeatPatterns.Quarterly:
      calcDateOffset = (d, i) => isoDatePlusDays(d, i * 7 * 13);
      break;
    case RepeatPatterns.Yearly:
      calcDateOffset = (d, i) => isoDatePlusYears(d, i);
      break;
    default:
      calcDateOffset = null;
      break;
  }

  if (!calcDateOffset) {
    throw Error('Repeat Pattern Unknown.');
  }

  return Array(template.repeatFor)
    .fill(null)
    .map((_, i) =>
      mapTemplateToInstance(template, calcDateOffset(template.date, i))
    );
};
