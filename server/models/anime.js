const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const { composeWithMongoose } = require('graphql-compose-mongoose');

const {updateDateBeforeSave} = require('../graphql/common.js');
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
    trim: true,
    required: 'Episode is required'
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
    default: Date.now,
    unique: true
  },
  createdDate: {
    type: Date,
    default: Date.now
  }
});

const Anime = mongoose.model('Anime', AnimeSchema);
const AnimeTC = composeWithMongoose(Anime);
AnimeTC.addFields({
  season: {
    type: 'Json', // String, Int, Float, Boolean, ID, Json
    description: 'Seasonal anime information',
    resolve: (source, args, context, info) => {
      console.log(source, args, context, info);
      const item = source;
      const start = Common.getDateParts(item.start);
      const seriesStart = Common.getDateParts(item.series_start);

      return Object.assign({}, {
        inSeason: (start.year === seriesStart.year || start.month === seriesStart.month) && !!Common.getSeasonText(start.month),
        year: start.year,
        season: Common.getSeasonText(start.month),
        seasonName: function() {
          return `${this.season} ${this.year}`;
        }
      });
    }
  }
});

const extendConnection = AnimeTC
  .getResolver('connection')
  .addFilterArg({
    name: 'search',
    type: 'String',
    description: 'Search by regExp on title',
    query: (query, value, resolveParams) => { // eslint-disable-line
      query.title = new RegExp(value, 'gi'); // eslint-disable-line
    },
  })
  .addFilterArg({
    name: 'statusIn',
    type: [AnimeTC.getFieldType('status')],
    description: 'Status in given array',
    query: (rawQuery, value, resolveParams) => {
      if (value && value.length > 0) {
        rawQuery.status = { $in: value };
      }
    },
  });

const extendCreate = AnimeTC.getResolver('createOne').wrapResolve(updateDateBeforeSave('createdDate'));
const extendUpdate = AnimeTC.getResolver('updateById').wrapResolve(updateDateBeforeSave('updatedDate'));

extendConnection.name = 'connection';
extendCreate.name = 'createOne';
extendUpdate.name = 'updateById';
AnimeTC.addResolver(extendConnection);
AnimeTC.addResolver(extendCreate);
AnimeTC.addResolver(extendUpdate);

module.exports = {
  Anime,
  AnimeTC
}
