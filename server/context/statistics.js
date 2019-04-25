const { db, Anime, Manga } = require('../connectors');

const { StatType } = require('../constants/enums');

function resolveModel(t) {
  return t === StatType.Anime ? Anime : Manga;
}

module.exports = {
  resolveModel,
  async counts({ type, isAdult }, column, sortDirection) {
    const model = resolveModel(type);

    const counts = await model.findAll({
      raw: true,
      group: column,
      where: { isAdult },
      attributes: [[column, 'key'], [db.fn('COUNT', db.col('id')), 'value']],
      order: sortDirection ? [[column, sortDirection]] : undefined
    });

    return counts.map((x) => ({ ...x, key: `${x.key}` }));
  }
};
