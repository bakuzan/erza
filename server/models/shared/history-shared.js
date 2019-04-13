const mongoose = require('mongoose');
const Common = require('../../utils');

const historySharedSchema = {
  date: {
    type: Number,
    default: Date.now(),
    unique: true
  },
  rating: {
    type: Number,
    default: 0
  },
  note: {
    type: String,
    default: '',
    trim: true
  },
  isAdult: {
    type: Boolean,
    default: false
  }
};

const additionalFields = {
  dateStr: {
    type: 'String',
    description: 'Date field as a String',
    resolve: (source) => Common.getFormattedDateString(source.date),
    projection: { date: true }
  }
};

const dateRangeSearch = (type) => ({
  name: 'dateRange',
  type: [type.getFieldType('date')],
  description: 'Array of 2 dates in ms creating a date range.',
  query: (query, value, resolveParams) => {
    query.date = { $gte: value[0], $lt: value[1] };
  }
});

const groupedAggregation = function() {
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
          rating: 1,
          isAdult: 1,
          parent: 1
        })
      },
      { $match: postMatch },
      {
        $group: Object.assign(
          {},
          {
            _id: groupBy,
            average: { $avg: '$rating' },
            highest: { $max: '$rating' },
            lowest: { $min: '$rating' },
            ratings: { $push: '$rating' }
          },
          grouping
        )
      },
      { $sort: { _id: sort } }
    ]);
  };
};

module.exports = {
  historySharedSchema,
  dateRangeSearch,
  groupedAggregation,
  additionalFields
};
