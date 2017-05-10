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
  [`${prefix}Create`]: type.getResolver('createOne').wrapResolve(updateDatePreSave),
  [`${prefix}UpdateById`]: type.getResolver('updateById').wrapResolve(updateDatePreSave),
  [`${prefix}UpdateOne`]: type.getResolver('updateOne'),
  [`${prefix}UpdateMany`]: type.getResolver('updateMany'),
  [`${prefix}RemoveById`]: type.getResolver('removeById'),
  [`${prefix}RemoveOne`]: type.getResolver('removeOne'),
  [`${prefix}RemoveMany`]: type.getResolver('removeMany'),
})

const updateDatePreSave = next => resolveParams => {
  const { source, args, context, info } = resolveParams;
  console.log(source, args, context, info);
  const date = Date.now();
  resolveParams.args.input.record.updatedDate = date;
  if ('check for create' === true) resolveParams.args.input.record.createdDate = date;
  return next(resolveParams);
})

module.exports = {
  combineArrayOfObjects,
  constructQueryFields,
  constructMutationFields
}
