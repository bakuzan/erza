const seriesRelations = {
  tagList: tagModel => ({
    resolver: () => tagModel.getResolver('findByIds'),
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

const historySeriesLink = seriesType => ({
  resolver: () => seriesType.getResolver('findById'),
  prepareArgs: {
    _id: source => source.parent
  },
  projection: { parent: 1 }
});

const tagSeriesLink = seriesType => ({
  resolver: () => seriesType.getResolver('findMany'),
  prepareArgs: {
    filter: source => ({
      tags: `${source._id}`
    })
  },
  projection: { _id: 1 }
});

module.exports = {
  seriesRelations,
  historySeriesLink,
  tagSeriesLink
};
