const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const { composeWithMongoose } = require('graphql-compose-mongoose');

const Constants = require('../constants.js');
const itemSharedFields = require('./shared/fields');
const resolverExtentions = require('./shared/filters-combined');
const { groupedCount, findIn } = require('./shared/statistics');
const inSeasonCalc = require('./shared/in-season');

const AnimeSchema = new Schema(
  Object.assign({}, itemSharedFields, {
    episode: {
      type: Number,
      default: '0',
      trim: true,
      required: 'Episode is required'
    },
    series_episodes: {
      type: Number,
      default: 0
    },
    _legacyIsSeason: {
      type: Boolean,
      default: false
    }
  })
);

AnimeSchema.statics.getGroupedCount = groupedCount();
AnimeSchema.statics.findIn = findIn();

const Anime = mongoose.model('Anime', AnimeSchema);
const AnimeTC = composeWithMongoose(Anime);
resolverExtentions(AnimeTC, Constants.type.anime, Anime);

AnimeTC.addFields({
  season: {
    type: 'Json', // String, Int, Float, Boolean, ID, Json
    description: 'Seasonal anime information',
    resolve: (source) => inSeasonCalc(source),
    projection: {
      _legacyIsSeason: 1,
      start: 1,
      end: 1,
      series_start: 1,
      series_type: 1
    }
  }
});

module.exports = {
  Anime,
  AnimeTC
};
