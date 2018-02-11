const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const { composeWithMongoose } = require('graphql-compose-mongoose');
const { TagTC } = require('./tag.js');

const Constants = require('../constants.js');

const {
  itemSharedFields,
  resolverExtentions,
  groupedCount,
  findIn
} = require('./item-shared.js');

const MangaSchema = new Schema(
  Object.assign({}, itemSharedFields, {
    chapter: {
      type: Number,
      default: 0,
      trim: true,
      required: 'Chapter is required'
    },
    volume: {
      type: Number,
      default: 0,
      trim: true,
      required: 'Volume is required'
    },
    series_chapters: {
      type: Number,
      default: 0
    },
    series_volumes: {
      type: Number,
      default: 0
    }
  })
);

MangaSchema.statics.getGroupedCount = groupedCount();
MangaSchema.statics.findIn = findIn();

const Manga = mongoose.model('Manga', MangaSchema);
const MangaTC = composeWithMongoose(Manga);

MangaTC.addRelation('tagList', () => ({
  resolver: TagTC.getResolver('findByIds'),
  args: {
    _ids: source => source.tags
  },
  projection: { tags: 1 }
}));

resolverExtentions(MangaTC, Constants.type.manga);

module.exports = {
  Manga,
  MangaTC
};
