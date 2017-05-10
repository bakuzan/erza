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
  [`${prefix}Create`]: type.getResolver('createOne').wrapResolve(updateDatePreSave('createdDate')),
  [`${prefix}UpdateById`]: type.getResolver('updateById').wrapResolve(updateDatePreSave('updatedDate')),
  [`${prefix}UpdateOne`]: type.getResolver('updateOne'),
  [`${prefix}UpdateMany`]: type.getResolver('updateMany'),
  [`${prefix}RemoveById`]: type.getResolver('removeById'),
  [`${prefix}RemoveOne`]: type.getResolver('removeOne'),
  [`${prefix}RemoveMany`]: type.getResolver('removeMany'),
})

const updateDatePreSave = property => next => resolveParams => {
  const { source, args, context, info } = resolveParams;
  console.log(source, args, context, info);
  resolveParams.args.input.record[property] = new Date();
  return next(resolveParams);
})

module.exports = {
  combineArrayOfObjects,
  constructQueryFields,
  constructMutationFields
}
