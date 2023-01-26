module.exports = function validateRelations(relations = []) {
  const items = [];

  for (let rel of relations) {
    if (rel.malId && rel.type && rel.type.trim()) {
      items.push({ ...rel, type: rel.type.toLowerCase() });
    }
  }

  return items;
};
