module.exports = function validateSortOrder(defaults, sorting) {
  const [field, direction] = sorting || defaults;

  if (!['ASC', 'DESC'].includes(direction)) {
    throw new Error("Sort direction invalid. Must be one of: 'ASC', 'DESC'");
  }

  return [field, direction];
};
