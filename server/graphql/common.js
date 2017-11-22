const { addOnMal, updateOnMal } = require('../myanimelist/mal-update');

const combineArrayOfObjects = (prev, curr) => Object.assign({}, prev, curr);

const constructQueryFields = ({ prefix, type }) => ({
  [`${prefix}ById`]       : type.getResolver('findById'),
  [`${prefix}ByIds`]      : type.getResolver('findByIds'),
  [`${prefix}One`]        : type.getResolver('findOne'),
  [`${prefix}Many`]       : type.getResolver('findMany'),
  [`${prefix}Total`]      : type.getResolver('count'),
  [`${prefix}Connection`] : type.getResolver('connection'),
})

const constructMutationFields = ({ prefix, type }) => ({
  [`${prefix}Create`]: type.getResolver('createOne'),
  [`${prefix}UpdateById`]: type.getResolver('updateById'),
  [`${prefix}UpdateOne`]: type.getResolver('updateOne'),
  [`${prefix}UpdateMany`]: type.getResolver('updateMany'),
  [`${prefix}RemoveById`]: type.getResolver('removeById'),
  [`${prefix}RemoveOne`]: type.getResolver('removeOne'),
  [`${prefix}RemoveMany`]: type.getResolver('removeMany'),
})

const updateDateBeforeSave = property => next => resolveParams => {
  resolveParams.args.record[property] = new Date();
  return next(resolveParams);
}

const START_OF_1970 = new Date("1970-01-01")
const isDatePre1970 = d => !!d && new Date(d) < START_OF_1970
const preventDatesPre1970 = next => resolveParams => {
  if (isDatePre1970(resolveParams.args.record.series_start)) {
    resolveParams.args.record.series_start = null
  }

  if (isDatePre1970(resolveParams.args.record.series_end)) {
    resolveParams.args.record.series_end = null
  }
  return next(resolveParams);
}


const addMalEntry = type => next => resolveParams => {
  addOnMal(type, resolveParams.args.record);
  return next(resolveParams);
}

const updateMalEntry = type => next => resolveParams => {
  updateOnMal(type, resolveParams.args.record);
  return next(resolveParams);
}

module.exports = {
  updateDateBeforeSave,
  preventDatesPre1970,
  addMalEntry,
  updateMalEntry,
  combineArrayOfObjects,
  constructQueryFields,
  constructMutationFields
}
