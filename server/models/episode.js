const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const { composeWithMongoose } = require('graphql-compose-mongoose');
const {AnimeTC} = require('./anime.js');
const {
  historySharedSchema,
  dateRangeSearch,
  groupedAggregation
} = require('./history-shared.js');

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

EpisodeTC.addRelation(
  'series',
  () => ({
    resolver: AnimeTC.getResolver('findById'),
    args: {
      _id: (source) => source.parent,
    },
    projection: { parent: 1 }
  })
)

console.log();
const extendConnection = EpisodeTC
  .getResolver('connection')
  .addFilterArg(dateRangeSearch(EpisodeTC));

extendConnection.name = 'connection';
EpisodeTC.addResolver(extendConnection);

module.exports = {
  Episode,
  EpisodeTC
}
