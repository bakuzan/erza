const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const { composeWithMongoose } = require('graphql-compose-mongoose');
const {TagTC} = require('./tag.js');

const {updateDateBeforeSave} = require('../graphql/common.js');
const Common = require('../utils/common.js');
const {
  itemSharedFields,
  searchFilterArg,
  statusInFilterArg
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
    }
  })
);

const Anime = mongoose.model('Anime', AnimeSchema);
const AnimeTC = composeWithMongoose(Anime);

AnimeTC.addRelation(
  'tagList',
  () => ({
    resolver: TagTC.getResolver('findByIds'),
    args: {
      _ids: (source) => source.tags,
    },
    projection: { tags: 1 }
  })
)

AnimeTC.addFields({
  season: {
    type: 'Json', // String, Int, Float, Boolean, ID, Json
    description: 'Seasonal anime information',
    resolve: (source, args, context, info) => {
      const item = source;
      const start = Common.getDateParts(item.start);
      const seriesStart = Common.getDateParts(item.series_start);

      return Object.assign({}, {
        inSeason: start.year === seriesStart.year && start.month === seriesStart.month && !!Common.getSeasonText(start.month),
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
  .addFilterArg(searchFilterArg)
  .addFilterArg(statusInFilterArg(AnimeTC));

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
