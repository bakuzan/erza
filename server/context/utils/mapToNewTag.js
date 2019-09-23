module.exports = function mapToNewTag(isAdult) {
  return function(data) {
    const { name } = data;
    return { name, isAdult };
  };
};
