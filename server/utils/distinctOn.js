module.exports = function distinctOn(...props) {
  return (item, index, arr) =>
    arr.findIndex((x) => props.every((p) => x[p] === item[p])) === index;
};
