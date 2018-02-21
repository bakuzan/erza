const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const { composeWithMongoose } = require('graphql-compose-mongoose');

const {
  historySharedSchema,
  dateRangeSearch
} = require('./shared/history-shared.js');

const ChapterSchema = new Schema(
  Object.assign({}, historySharedSchema, {
    parent: {
      type: ObjectId,
      ref: 'Manga'
    },
    chapter: {
      type: Number,
      required: 'Chapter is a required field'
    }
  })
);

const Chapter = mongoose.model('Chapter', ChapterSchema);
const ChapterTC = composeWithMongoose(Chapter);

const extendConnection = ChapterTC.getResolver('connection').addFilterArg(
  dateRangeSearch(ChapterTC)
);

extendConnection.name = 'connection';
ChapterTC.addResolver(extendConnection);

module.exports = {
  Chapter,
  ChapterTC
};
