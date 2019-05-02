module.exports = function groupBy(xs, fn) {
  return xs.reduce(function(rv, x) {
    const k = fn(x);
    (rv[k] = rv[k] || []).push(x);
    return rv;
  }, {});
};
