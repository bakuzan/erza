const { Anime, Manga } = require('../connectors');

const Constants = require('../constants');

function resolveModel(t) {
  return t === Constants.type.anime ? Anime : Manga;
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
