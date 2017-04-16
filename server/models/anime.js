const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const Common = require('../utils/common.js');

const AnimeSchema = new Schema({
  title: {
    type: String,
    unique: 'Title must be unique.',
    default: '',
    required: 'Please fill in an anime title',
    trim: true
  },
  episode: {
    type: Number,
    default: '0',
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
    type: Number
  },
  series_type: {
    type: Number,
    default: 0
  },
  series_episodes: {
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
    default: Date.now
	},
  createdDate: {
		type: Date,
		default: Date.now
  }
});

AnimeSchema.virtual('season').get(function() {
  const item = this;
  const start = Common.getDateParts(item.start);
  const seriesStart = Common.getDateParts(item.series_start);

  return Object.assign({}, {
    inSeason: (start.year !== seriesStart.year || start.month !== seriesStart.month) && !Common.getSeasonText(start.month),
    year: start.year,
    season: Common.getSeasonText(start.month),
    seasonName: function() {
      return `${this.season} ${this.year}`;
    }
  });
});

module.exports = mongoose.model('Anime', AnimeSchema);
