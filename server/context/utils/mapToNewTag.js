module.exports = function mapToNewTag(data) {
  const { name, isAdult } = data;
  return { name, isAdult };
};
