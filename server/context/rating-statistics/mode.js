function buildNestedList(arr) {
  const first = arr[0];
  if (!first && first !== 0) {
    return [];
  }

  return [arr.filter((x) => x === first)].concat(
    buildNestedList(arr.filter((x) => x !== first))
  );
}

module.exports = function getMode(arr) {
  const start = { length: 0, number: 0 };

  const { number } = buildNestedList(arr).reduce((p, c) => {
    const length = c.length;

    if (length > p.length) {
      const number = c[0];

      return number ? { length, number } : p;
    }

    return p;
  }, start);

  return number;
};
