const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const { composeWithMongoose } = require('graphql-compose-mongoose');
const {TagTC} = require('./tag.js');

const {updateDateBeforeSave, addMalEntry, updateMalEntry} = require('../graphql/common.js');
const {type} = require('../constants.js');

const {
  itemSharedFields,
  searchFilterArg,
  statusInFilterArg,
  groupedCount
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


MangaSchema.statics.getGroupedCount = function(groupBy, sort, match, callback) {
  return this.aggregate(groupedCount(groupBy, sort, match), callback);
}

const Manga = mongoose.model('Manga', MangaSchema);
const MangaTC = composeWithMongoose(Manga);


MangaTC.addRelation(
  'tagList',
  () => ({
    resolver: TagTC.getResolver('findByIds'),
    args: {
      _ids: (source) => source.tags,
    },
    projection: { tags: 1 }
  })
)

const extendConnection = MangaTC
  .getResolver('connection')
  .addFilterArg(searchFilterArg)
  .addFilterArg(statusInFilterArg(MangaTC));

const extendCreate = MangaTC.getResolver('createOne')
                            .wrapResolve(updateDateBeforeSave('createdDate'))
                            .wrapResolve(addMalEntry(type.manga));

const extendUpdate = MangaTC.getResolver('updateById')
                            .wrapResolve(updateDateBeforeSave('updatedDate'))
                            .wrapResolve(updateMalEntry(type.manga));

extendConnection.name = 'connection';
extendCreate.name = 'createOne';
extendUpdate.name = 'updateById';
MangaTC.addResolver(extendConnection);
MangaTC.addResolver(extendCreate);
MangaTC.addResolver(extendUpdate);

module.exports = {
  Manga,
  MangaTC
}
