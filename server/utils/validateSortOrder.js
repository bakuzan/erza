module.exports = function validateSortOrder(defaults, sorting) {
  const value = sorting || defaults;

  if (value.length != 2) {
    return defaults;
  }

  return sorting;
};
