const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const { composeWithMongoose } = require('graphql-compose-mongoose');

const Common = require('../utils/common.js');
const Constants = require('../constants.js');
const itemSharedFields = require('./shared/fields');
const resolverExtentions = require('./shared/filters-combined');
const { groupedCount, findIn } = require('./shared/statistics');

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
    resolve: (source, args, context, info) => {
      const item = source;
      const start = Common.getDateParts(item.start);
      const end = Common.getDateParts(item.end);
      const seriesStart = Common.getDateParts(item.series_start);
      const dateParts = seriesStart.month ? seriesStart : start;

      return Object.assign(
        {},
        {
          inSeason:
            item._legacyIsSeason ||
            (start.year === seriesStart.year &&
              start.month === seriesStart.month &&
              (start.year !== end.year || start.month !== end.month) &&
              Constants.seasonalTypes.indexOf(item.series_type) !== -1),
          year: start.year,
          season: Common.getSeasonText(dateParts)
        }
      );
    },
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
