const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const { composeWithMongoose } = require('graphql-compose-mongoose');

const {
  historySharedSchema,
  dateRangeSearch,
  groupedAggregation
} = require('./shared/history-shared.js');

const EpisodeSchema = new Schema(
  Object.assign({}, historySharedSchema, {
    parent: {
      type: ObjectId,
      ref: 'Anime'
    },
    episode: {
      type: Number,
      required: 'Episode is a required field'
    }
  })
);

EpisodeSchema.statics.getGroupedAggregation = groupedAggregation();

const Episode = mongoose.model('Episode', EpisodeSchema);
const EpisodeTC = composeWithMongoose(Episode);

const extendConnection = EpisodeTC.getResolver('connection').addFilterArg(
  dateRangeSearch(EpisodeTC)
);

extendConnection.name = 'connection';
EpisodeTC.addResolver(extendConnection);

module.exports = {
  Episode,
  EpisodeTC
};
