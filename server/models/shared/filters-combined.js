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
  timesCompleteGreaterThanFilterArg
} = require('./filters');

const resolverExtentions = (type, typeString) => {
  const extendConnection = type
    .getResolver('connection')
    .addFilterArg(searchFilterArg)
    .addFilterArg(statusInFilterArg(type))
    .addFilterArg(ratingInFilterArg(type))
    .addFilterArg(timesCompleteGreaterThanFilterArg);

  const extendMany = type
    .getResolver('findMany')
    .addFilterArg(searchFilterArg)
    .addFilterArg(statusInFilterArg(type))
    .addFilterArg(ratingInFilterArg(type))
    .addFilterArg(timesCompleteGreaterThanFilterArg);

  const extendCreate = type
    .getResolver('createOne')
    .wrapResolve(updateDateBeforeSave('createdDate'))
    .wrapResolve(addMalEntry(typeString))
    .wrapResolve(preventDatesPre1970);

  const extendUpdate = type
    .getResolver('updateById')
    .wrapResolve(updateDateBeforeSave('updatedDate'))
    .wrapResolve(updateMalEntry(typeString))
    .wrapResolve(preventDatesPre1970);

  extendConnection.name = 'connection';
  extendMany.name = 'findMany';
  extendCreate.name = 'createOne';
  extendUpdate.name = 'updateById';
  type.addResolver(extendConnection);
  type.addResolver(extendMany);
  type.addResolver(extendCreate);
  type.addResolver(extendUpdate);
};

module.exports = resolverExtentions;
