const { Anime, Manga } = require('../connectors');

const { StatType } = require('../constants/enums');

function resolveModel(t) {
  return t === StatType.Anime ? Anime : Manga;
}

module.exports = {
  resolveModel,
  async counts({ type, isAdult }, column, sortDirection) {
    const model = resolveModel(type);

    const counts = await model.findAll({
      group: column,
      where: { isAdult },
      attributes: [column, [db.fn('COUNT', db.col('id')), 'count']],
      order: [[column, sortDirection]]
    });

    return counts;
  }
};
