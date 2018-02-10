const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const { composeWithMongoose } = require('graphql-compose-mongoose');
const { TagTC } = require('./tag.js');

const {
  updateDateBeforeSave,
  preventDatesPre1970,
  addMalEntry,
  updateMalEntry
} = require('../graphql/common.js');
const Common = require('../utils/common.js');
const Constants = require('../constants.js');

const {
  itemSharedFields,
  searchFilterArg,
  statusInFilterArg,
  ratingInFilterArg,
  groupedCount,
  findIn
} = require('./item-shared.js');

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

AnimeTC.addRelation('tagList', () => ({
  resolver: TagTC.getResolver('findByIds'),
  args: {
    _ids: source => source.tags
  },
  projection: { tags: 1 }
}));

AnimeTC.addFields({
  season: {
    type: 'Json', // String, Int, Float, Boolean, ID, Json
    description: 'Seasonal anime information',
    resolve: (source, args, context, info) => {
      const item = source;
      const start = Common.getDateParts(item.start);
      const seriesStart = Common.getDateParts(item.series_start);

      return Object.assign(
        {},
        {
          inSeason:
            item._legacyIsSeason ||
            (start.year === seriesStart.year &&
              start.month === seriesStart.month &&
              Constants.seasonalTypes.indexOf(item.series_type) !== -1),
          year: start.year,
          season: Common.getSeasonText(seriesStart.month || start.month)
        }
      );
    }
  }
});

const extendConnection = AnimeTC.getResolver('connection')
  .addFilterArg(searchFilterArg)
  .addFilterArg(statusInFilterArg(AnimeTC))
  .addFilterArg(ratingInFilterArg(AnimeTC));

const extendCreate = AnimeTC.getResolver('createOne')
  .wrapResolve(updateDateBeforeSave('createdDate'))
  .wrapResolve(addMalEntry(Constants.type.anime))
  .wrapResolve(preventDatesPre1970);

const extendUpdate = AnimeTC.getResolver('updateById')
  .wrapResolve(updateDateBeforeSave('updatedDate'))
  .wrapResolve(updateMalEntry(Constants.type.anime))
  .wrapResolve(preventDatesPre1970);

extendConnection.name = 'connection';
extendCreate.name = 'createOne';
extendUpdate.name = 'updateById';
AnimeTC.addResolver(extendConnection);
AnimeTC.addResolver(extendCreate);
AnimeTC.addResolver(extendUpdate);

module.exports = {
  Anime,
  AnimeTC
};
