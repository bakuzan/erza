const groupedCount = function() {
  return function({
    groupBy,
    sort,
    match = {},
    project = {},
    postMatch = {},
    grouping = {}
  }) {
    return this.aggregate([
      { $match: match },
      {
        $project: Object.assign({}, project, {
          _id: 1,
          status: 1,
          rating: 1,
          start: 1,
          end: 1,
          series_start: 1,
          series_type: 1,
          _legacyIsSeason: 1
        })
      },
      { $match: postMatch },
      {
        $group: Object.assign(
          {},
          { _id: groupBy, value: { $sum: 1 } },
          grouping
        )
      },
      { $sort: { _id: sort } }
    ]);
  };
};

const findIn = function() {
  return function(arr) {
    return this.find(
      { _id: { $in: arr } },
      { id: 1, title: 1, rating: 1, start: 1 }
    );
  };
};

module.exports = {
  groupedCount,
  findIn
};
