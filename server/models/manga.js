const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const { composeWithMongoose } = require('graphql-compose-mongoose');

const Constants = require('../constants.js');

const { ChapterTC } = require('./chapter');
const itemSharedFields = require('./shared/fields');
const resolverExtentions = require('./shared/filters-combined');
const { groupedCount, findIn } = require('./shared/statistics');
const { relationFields } = require('./shared/linked-relations');

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

MangaTC.addRelation('tagList', relationFields.tagList());
MangaTC.addRelation('historyList', relationFields.historyList(ChapterTC));
resolverExtentions(MangaTC, Constants.type.manga);

module.exports = {
  Manga,
  MangaTC
};
