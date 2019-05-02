module.exports = {
  getMaximum(arr) {
    return Math.max(...arr);
  },
  getMinimum(arr) {
    const values = arr.filter((x) => !!x); // exclude 0
    return Math.min(...values);
  }
};
