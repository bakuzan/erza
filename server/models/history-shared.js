const mongoose = require('mongoose');

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

const dateRangeSearch = type => ({
  name: 'dateRange',
  type: [type.getFieldType('date')],
  description: 'Array of 2 dates in ms creating a date range.',
  query: (query, value, resolveParams) => {
    query.date = { $gte: value[0], $lt: value[1] }
  },
})

module.exports = {
  historySharedSchema,
  dateRangeSearch
}
