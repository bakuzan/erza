module.exports = function separateNewVsExistingTags(list) {
  const tags = list || [];
  const newTags = tags.filter((x) => x.id === -1);
  const existingTags = tags.filter((x) => x.id !== -1).map((x) => x.id);

  return {
    newTags,
    existingTags
  };
};
