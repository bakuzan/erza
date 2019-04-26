const Op = require('sequelize').Op;

const Stats = require('./statistics');
const { Status } = require('../constants/enums');
const dateRange = require('../utils/dateRange');

const isOwnedOnlyArgs = require('./utils/isOwnedOnlyArgs');
const setHasMoreFlag = require('./utils/setHasMoreFlag');
const validateSortOrder = require('./utils/validateSortOrder');
const resolveWhereIn = require('./utils/resolveWhereIn');

// Query

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
  const isOwnedWhere = isOwnedOnlyArgs(isOwnedOnly);
  const sortOrder = validateSortOrder(['title', 'ASC'], sorting);
  const statusWhere = resolveWhereIn(status, 'status');

  return model
    .findAndCountAll({
      where: {
        title: {
          [Op.like]: `%${search}%`
        },
        isAdult: { [Op.eq]: isAdult },
        ...statusWhere,
        ...isOwnedWhere
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
  { fromDate, toDate, ratings = [], paging = { page: 0, size: 10 } },
  where,
  options
) {
  const [from, to] = dateRange(fromDate, toDate);
  const ratingWhere = resolveWhereIn(ratings, 'rating');

  return model
    .findAndCountAll({
      where: {
        date: {
          [Op.gte]: from,
          [Op.lt]: to
        },
        ...ratingWhere,
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

module.exports = {
  pagedSeries,
  pagedHistory
};
