const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.ObjectId;

const itemSharedFields = {
  title: {
    type: String,
    unique: 'Title must be unique.',
    default: '',
    required: 'Please fill in an anime title',
    trim: true
  },
  start: {
    type: Date,
    default: Date.now
  },
  end: {
    type: Date
  },
  status: {
    type: Number,
    default: 6 // 1 / ongoing, 2 / completed, 3 / onhold, 4 / dropped, 6 / planned
  },
  owned: {
    type: Boolean,
    default: false
  },
  rating: {
    type: Number,
    default: 0
  },
  isAdult: {
    type: Boolean,
    default: false
  },
  isRepeat: {
    type: Boolean,
    default: false
  },
  timesCompleted: {
    type: Number,
    default: 0
  },
  image: {
    type: String,
    default: ''
  },
  link: {
    type: String,
    default: ''
  },
  tags: [{
    type: ObjectId,
    ref: 'Tag'
  }],
	malId: {
    type: Number,
    unique: true
  },
  series_type: {
    type: Number,
    default: 0
  },
  series_start: {
    type: Date
  },
  series_end: {
    type: Date
  },
  updatedDate: {
    type: Date,
    default: Date.now,
    unique: true
  },
  createdDate: {
    type: Date,
    default: Date.now
  }
};

const searchFilterArg = {
  name: 'search',
  type: 'String',
  description: 'Search by regExp on title',
  query: (query, value, resolveParams) => {
    const str = value.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'); // Escape all regex special characters
    query.title = new RegExp(str, 'gi');
  },
}

const statusInFilterArg = type => ({
  name: 'statusIn',
  type: [type.getFieldType('status')],
  description: 'Status in given array',
  query: (rawQuery, value, resolveParams) => {
    if (value && value.length > 0) {
      rawQuery.status = { $in: value };
    }
  },
})

const groupedCount = function() {
  return function ({ groupBy, sort, match = {}, project = {}, postMatch = {} }) {
    return this.aggregate([
      { $match: match },
      { $project: Object.assign({}, project, { _id: 1, status: 1, rating: 1, start: 1, end: 1, series_start: 1, series_type: 1, _legacyIsSeason: 1 }) },
      { $match: postMatch },
      { $group: { _id: groupBy, value: { $sum: 1 } } },
      { $sort : { _id: sort } }
    ]);
  }
}

const findIn = function() {
  return function(arr) {
    return this.find({ _id: { $in: arr } }, { id: 1, title: 1, rating: 1 });
  }
}

module.exports = {
  itemSharedFields,
  searchFilterArg,
  statusInFilterArg,
  groupedCount,
  findIn
}
