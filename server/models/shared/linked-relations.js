const Constants = require('../../constants');
const { TagTC } = require('../tag');

const relationFields = {
  tagList: () => ({
    resolver: TagTC.getResolver('findByIds'),
    args: {
      _ids: source => source.tags
    },
    projection: { tags: 1 }
  })
};

const linkedSeriesRelation = (name, seriesType) =>
  TagTC.addRelation(name, () => ({
    resolver: seriesType.getResolver('findMany'),
    args: {
      filter: source => ({
        tags: `${source._id}`
      })
    },
    projection: { _id: 1 }
  }));

module.exports = {
  relationFields,
  linkedSeriesRelation
};