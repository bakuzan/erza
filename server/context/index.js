const Op = require('sequelize').Op;

const Stats = require('./statistics');
const Constants = require('../constants');
const isOwnedOnlyArgs = require('../utils/isOwnedOnlyArgs');
const setHasMoreFlag = require('../utils/setHasMoreFlag');
const validateSortOrder = require('../utils/validateSortOrder');
const dateRange = require('../utils/dateRange');

async function pagedSeries(
  model,
  {
    search = '',
    status = [],
    isOwnedOnly = false,
    isAdult = false,
    sorting,
    paging = { page: 0, size: 10 }
  }
) {
  const resolvedArgs = isOwnedOnlyArgs(isOwnedOnly);
  const sortOrder = validateSortOrder(['title', 'ASC'], sorting);

  return model
    .findAndCountAll({
      where: {
        title: {
          [Op.like]: `%${search}%`
        },
        status: { [Op.in]: status },
        isAdult: { [Op.eq]: isAdult },
        ...resolvedArgs
      },
      order: [sortOrder],
      limit: paging.size,
      offset: paging.size * paging.page
    })
    .then((result) => ({
      nodes: result.rows,
      total: result.count,
      hasMore: setHasMoreFlag(result.count, paging)
    }));
}

async function pagedHistory(
  model,
  where,
  options,
  { fromDate, toDate, ratings = [], paging = { page: 0, size: 10 } }
) {
  const [from, to] = dateRange(fromDate, toDate);
  return model
    .findAndCountAll({
      where: {
        date: {
          [Op.gte]: from,
          [Op.lt]: to
        },
        rating: {
          [Op.in]: ratings
        },
        ...where
      },
      order: [['date', 'DESC']],
      limit: paging.size,
      offset: paging.size * paging.page,
      ...options
    })
    .then((result) => ({
      nodes: result.rows,
      total: result.count,
      hasMore: setHasMoreFlag(result.count, paging)
    }));
}

async function checkIfSeriesAlreadyExists(model, { id, malId, title = '' }) {
  const series = await model.findOne({
    where: {
      id: { [Op.ne]: id },
      [Op.or]: [{ malId: { [Op.eq]: malId } }, { title: { [Op.eq]: title } }]
    }
  });

  return series !== null;
}

async function findAllRepeated(
  model,
  { search = '', minTimesCompleted = 1, isAdult }
) {
  return await model.findAll({
    where: {
      title: {
        [Op.like]: `%${search}%`
      },
      isAdult: { [Op.eq]: isAdult },
      status: { [Op.eq]: Constants.status.completed },
      [Op.or]: [
        { isRepeat: true },
        { timesCompleted: { [Op.gte]: minTimesCompleted } }
      ]
    },
    order: [['timesCompleted', 'DESC'], ['title', 'ASC']]
  });
}

module.exports = {
  pagedSeries,
  pagedHistory,
  checkIfSeriesAlreadyExists,
  findAllRepeated,
  Stats
};
