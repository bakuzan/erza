const Constants = require('../../constants');
const { TagTC } = require('../tag');

const relationFields = {
  tagList: () => ({
    resolver: () => TagTC.getResolver('findByIds'),
    prepareArgs: {
      _ids: source => source.tags
    },
    projection: { tags: 1 }
  }),
  historyList: historyModel => ({
    resolver: () => historyModel.getResolver('findMany'),
    prepareArgs: {
      filter: source => ({
        parent: `${source._id}`
      })
    },
    projection: { _id: 1 }
  })
};

module.exports = {
  relationFields
};
