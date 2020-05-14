const stringToBool = (s) => s && s.toLowerCase() == 'true';

function getDateParts(date) {
  if (!date) {
    return {};
  }

  const d = new Date(date);
  return {
    year: d.getFullYear(),
    month: d.getMonth(),
    date: d.getDate()
  };
}

function padNumber(n, width, z = 0) {
  n += '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

function resolveSorting(sorting) {
  return sorting ? [[sorting.field.toLowerCase(), sorting.order]] : undefined;
}

module.exports = {
  getDateParts,
  stringToBool,
  padNumber,
  resolveSorting
};
