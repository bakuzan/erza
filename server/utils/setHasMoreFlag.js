module.exports = function setHasMoreFlag(total, paging) {
  const nodesSoFar = paging.page * paging.size + paging.size;
  return total - nodesSoFar > 0;
};
