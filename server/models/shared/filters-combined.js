const { capitalise } = require('../../utils/common');
const {
  updateDateBeforeSave,
  preventDatesPre1970,
  addMalEntry,
  updateMalEntry
} = require('../../graphql/common.js');
const {
  searchFilterArg,
  statusInFilterArg,
  ratingInFilterArg,
  timesCompletedMinFilterArg
} = require('./filters');

const resolverExtentions = (type, typeString, dbContext) => {
  type.wrapResolver('connection', newResolver =>
    newResolver
      .addFilterArg(searchFilterArg)
      .addFilterArg(statusInFilterArg(type))
      .addFilterArg(ratingInFilterArg(type))
      .addFilterArg(timesCompletedMinFilterArg)
  );

  type.wrapResolver('findMany', newResolver =>
    newResolver
      .addFilterArg(searchFilterArg)
      .addFilterArg(statusInFilterArg(type))
      .addFilterArg(ratingInFilterArg(type))
      .addFilterArg(timesCompletedMinFilterArg)
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

  type.wrapResolver('findManyRepeated', newResolver =>
    newResolver.addFilterArg(searchFilterArg)
  );

  type.wrapResolver('createOne', newResolver =>
    newResolver
      .wrapResolve(updateDateBeforeSave('createdDate'))
      .wrapResolve(addMalEntry(typeString))
      .wrapResolve(preventDatesPre1970)
  );

  type.wrapResolver('updateById', newResolver =>
    newResolver
      .wrapResolve(updateDateBeforeSave('updatedDate'))
      .wrapResolve(updateMalEntry(typeString))
      .wrapResolve(preventDatesPre1970)
  );
};

module.exports = resolverExtentions;
