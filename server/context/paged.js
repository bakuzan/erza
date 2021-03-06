const Op = require('sequelize').Op;

const { db } = require('../connectors');
const SQL = require('../db-scripts');
const { StatType } = require('../constants/enums');

const seriesAverageHistoryRating = require('./seriesAverageHistoryRating');
const dateRange = require('../utils/dateRange');
const isOwnedOnlyArgs = require('./utils/isOwnedOnlyArgs');
const setHasMoreFlag = require('./utils/setHasMoreFlag');
const resolveWhereIn = require('./utils/resolveWhereIn');
const processArray = require('./utils/processArray');
const validateSortOrder = require('./validators/validateSortOrder');

// Query

async function pagedSeries(
  model,
  {
    search = '',
    status = [],
    ratings = [],
    seriesTypes = [],
    isOwnedOnly = false,
    isAdult = false,
    sorting,
    paging = { page: 0, size: 10 }
  }
) {
  const isOwnedWhere = isOwnedOnlyArgs(isOwnedOnly);
  const statusWhere = resolveWhereIn(status, 'status');
  const ratingsWhere = resolveWhereIn(ratings, 'rating');
  const seriesTypesWhere = resolveWhereIn(seriesTypes, 'series_type');
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
        ...seriesTypesWhere,
        ...isOwnedWhere
      },
      order: [sortOrder, ['title', 'ASC']],
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
  const averageRating = await seriesAverageHistoryRating(model, seriesId);

  return await model
    .findAndCountAll({
      where: {
        ...dateWhere,
        ...ratingWhere,
        ...where
      },
      order: [sortOrder, [model.getTableName().slice(0, -1), 'DESC']],
      limit: paging.size,
      offset: paging.size * paging.page,
      ...options
    })
    .then((result) => ({
      nodes: result.rows,
      total: result.count,
      hasMore: setHasMoreFlag(result.count, paging),
      averageRating
    }));
}

async function pagedSeriesByTags({
  type,
  tagIds = [],
  search = '',
  paging = {}
}) {
  const { page = 0, size = 20 } = paging;

  const queryKeys =
    type === StatType.Anime
      ? {
          count: 'get_series_with_tags_anime_count',
          find: 'get_series_with_tags_anime'
        }
      : {
          count: 'get_series_with_tags_manga_count',
          find: 'get_series_with_tags_manga'
        };

  const [totalData] = await db.query(SQL[queryKeys.count], {
    type: db.QueryTypes.SELECT,
    replacements: {
      search: `%${search}%`,
      tagIds: processArray(tagIds)
    }
  });

  const total = totalData && totalData.total ? totalData.total : 0;

  const nodes = await db.query(SQL[queryKeys.find], {
    type: db.QueryTypes.SELECT,
    replacements: {
      search: `%${search}%`,
      tagIds: processArray(tagIds),
      limit: size,
      offset: size * page
    }
  });

  return {
    nodes,
    total,
    hasMore: setHasMoreFlag(total, { page, size })
  };
}

module.exports = {
  pagedSeries,
  pagedHistory,
  pagedSeriesByTags
};
