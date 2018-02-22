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
  tags: [
    {
      type: ObjectId,
      ref: 'Tag'
    }
  ],
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

module.exports = itemSharedFields;
