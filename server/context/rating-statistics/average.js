module.exports = function getAverage(arr) {
  const values = arr.filter((x) => !!x); // exclude 0
  if (!values.length) {
    return 0;
  }

  return values.reduce((p, c) => p + c) / values.length;
};
