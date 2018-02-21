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

EpisodeTC.wrapResolver('connection', newResolver =>
  newResolver.addFilterArg(dateRangeSearch(EpisodeTC))
);

module.exports = {
  Episode,
  EpisodeTC
};
