const Op = require('sequelize').Op;

const Stats = require('./statistics');
const { Status } = require('../constants/enums');
const dateRange = require('../utils/dateRange');

const isOwnedOnlyArgs = require('./utils/isOwnedOnlyArgs');
const setHasMoreFlag = require('./utils/setHasMoreFlag');
const resolveWhereIn = require('./utils/resolveWhereIn');
const validateSortOrder = require('./validators/validateSortOrder');

// Query

async function pagedSeries(
  model,
  {
    search = '',
    status = [],
    ratings = [],
    isOwnedOnly = false,
    isAdult = false,
    sorting,
    paging = { page: 0, size: 10 }
  }
) {
  const isOwnedWhere = isOwnedOnlyArgs(isOwnedOnly);
  const statusWhere = resolveWhereIn(status, 'status');
  const ratingsWhere = resolveWhereIn(ratings, 'rating');
  const sortOrder = validateSortOrder(['title', 'ASC'], sorting);

  return await model
    .findAndCountAll({
      where: {
        title: {
          [Op.like]: `%${search}%`
        },
        isAdult: { [Op.eq]: isAdult },
        ...statusWhere,
        ...ratingsWhere,
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
  {
    seriesId,
    fromDate,
    toDate,
    ratings = [],
    sorting,
    paging = { page: 0, size: 10 }
  },
  where,
  options
) {
  let dateWhere = {};
  const noSeriesId = !seriesId;

  if (noSeriesId) {
    const [from, to] = dateRange(fromDate, toDate);
    dateWhere = {
      date: {
        [Op.gte]: from,
        [Op.lt]: to
      }
    };
  }

  const ratingWhere = resolveWhereIn(ratings, 'rating');
  const sortOrder = validateSortOrder(['date', 'DESC'], sorting);

  return await model
    .findAndCountAll({
      where: {
        ...dateWhere,
        ...ratingWhere,
        ...where
      },
      order: [sortOrder],
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
