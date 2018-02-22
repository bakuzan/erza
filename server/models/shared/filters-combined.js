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

const resolverExtentions = (type, typeString) => {
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
