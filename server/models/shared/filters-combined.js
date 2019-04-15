const { TypeComposer } = require('graphql-compose');
const { getSeasonText, getDateParts } = require('../../utils');
const {
  updateDateBeforeSave,
  preventDatesPre1970
} = require('../../graphql/common.js');
const Functions = require('../../statistics/common.js');
const Episode = require('../episode.js').Episode;
const {
  searchFilterArg,
  statusInFilterArg,
  ratingInFilterArg,
  timesCompletedMinFilterArg,
  isOwnedOnlyFilterArg
} = require('./filters');
const inSeasonCalc = require('./in-season');

const EpisodeStatisticsTC = TypeComposer.create(`
  type EpisodeStatistics {
    _id: String
    average: Float
    highest: Int
    lowest: Int
    mode: Int
  }
`);
const AiringSeriesStatTC = TypeComposer.create(`
  type AiringSeriesStat {
    _id: String
    title: String
    rating: Int
    season: String
    episodeStatistics: EpisodeStatistics
  }  
`);

const resolverExtentions = (type, typeString, dbContext) => {
  type.wrapResolver('connection', (newResolver) =>
    newResolver
      .addFilterArg(searchFilterArg)
      .addFilterArg(statusInFilterArg(type))
      .addFilterArg(ratingInFilterArg(type))
      .addFilterArg(timesCompletedMinFilterArg)
      .addFilterArg(isOwnedOnlyFilterArg)
  );

  type.wrapResolver('findMany', (newResolver) =>
    newResolver
      .addFilterArg(searchFilterArg)
      .addFilterArg(statusInFilterArg(type))
      .addFilterArg(ratingInFilterArg(type))
      .addFilterArg(timesCompletedMinFilterArg)
      .addFilterArg(isOwnedOnlyFilterArg)
  );

  type.addResolver({
    kind: 'query',
    name: 'findManyRepeated',
    args: {
      filter: `input ${typeString}FilterInput {
        isAdult: Boolean
        timesCompletedMin: Float
      }`,
      limit: {
        type: 'Int',
        defaultValue: 1000
      },
      skip: 'Int'
    },
    type: [type],
    resolve: async ({ args, context, rawQuery }) => {
      const { timesCompletedMin, isAdult } = args.filter || {};
      const timesCompletedLimit = timesCompletedMin || 1;

      return dbContext
        .find({
          ...rawQuery,
          isAdult,
          status: 2,
          $or: [
            { isRepeat: true },
            { timesCompleted: { $gte: timesCompletedLimit } }
          ]
        })
        .sort({ timesCompleted: -1, title: 1 })
        .limit(args.limit)
        .skip(args.skip);
    }
  });

  type.wrapResolver('findManyRepeated', (newResolver) =>
    newResolver.addFilterArg(searchFilterArg)
  );

  type.addResolver({
    kind: 'query',
    name: 'checkIfExists',
    args: {
      filter: `input ${typeString}CheckFilterInput {
        id: ID
        malId: Float
        title: String
      }`
    },
    type: 'Boolean',
    resolve: async ({ args, context, rawQuery }) => {
      const { id, malId, title } = args.filter || {};
      const orArguments = [{ title: { $eq: title } }];
      const idCondition = !!id ? { _id: { $ne: id } } : {};

      const item = await dbContext
        .findOne({
          $and: [
            { ...idCondition },
            {
              $or: !malId
                ? orArguments
                : [...orArguments, { malId: { $eq: malId } }]
            }
          ]
        })
        .limit(1);
      return !!item;
    }
  });

  type.addResolver({
    kind: 'query',
    name: 'findManyAiring',
    args: {
      key: {
        // Exists because elm-gql requires args?
        type: 'String',
        defaultValue: ''
      }
    },
    type: [AiringSeriesStatTC],
    resolve: async () => {
      // Get Series
      const items = await dbContext.find({
        isAdult: false,
        status: 1
      });

      const inSeasonItems = items.filter((x) => inSeasonCalc(x).inSeason);
      const seriesIds = inSeasonItems.map(({ _id }) => _id);

      // Get Episodes
      const episodes = await Episode.getGroupedAggregation({
        groupBy: '$parent',
        sort: 1,
        match: { isAdult: false, parent: { $in: seriesIds } }
      });

      // Map and sort series
      return inSeasonItems.map((item) => {
        const { _id, title, rating, start } = item;
        const parentId = _id.toString();
        const epStats =
          episodes.find((x) => x._id.toString() === parentId) || {};
        const epRatings = (epStats.ratings || []).slice(0);
        delete epStats.ratings;

        return {
          _id,
          title,
          rating,
          season: getSeasonText(getDateParts(new Date(start))),
          episodeStatistics: {
            ...Functions.emptyEpisodeStatistic(),
            ...epStats,
            mode: Functions.getModeRating(epRatings)
          }
        };
      });
    }
  });

  type.wrapResolver('createOne', (newResolver) =>
    newResolver
      .wrapResolve(updateDateBeforeSave('createdDate'))
      .wrapResolve(preventDatesPre1970)
  );

  type.wrapResolver('updateById', (newResolver) =>
    newResolver
      .wrapResolve(updateDateBeforeSave('updatedDate'))
      .wrapResolve(preventDatesPre1970)
  );
};

module.exports = resolverExtentions;
