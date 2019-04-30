module.exports = function separateNewVsExistingTags(list) {
  const newTags = list.filter((x) => x.id === -1);
  const existingTags = list.filter((x) => x.id !== -1).map((x) => x.id);

  return {
    newTags,
    existingTags
  };
};
