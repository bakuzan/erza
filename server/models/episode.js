const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const { composeWithMongoose } = require('graphql-compose-mongoose');

const EpisodeSchema = new Schema({
  parent: {
    type: ObjectId,
    ref: 'Anime'
  },
  date: {
    type: Number,
    default: Date.now(),
    unique: true
  },
  episode: {
    type: Number,
    required: 'Episode is a required field'
  },
  rating: {
    type: Number,
    default: 0
  },
  note: {
    type: String,
    default: '',
    trim: true
  }
});

const Episode = mongoose.model('Episode', EpisodeSchema);
const EpisodeTC = composeWithMongoose(Episode);

const extendConnection = EpisodeTC
  .getResolver('connection')
  .addFilterArg({
    name: 'dateRange',
    type: [EpisodeTC.getFieldType('date')],
    description: 'Array of 2 dates in ms creating a date range.',
    query: (query, value, resolveParams) => {
      query.date = { $gte: value[0], $lt: value[1] }
    },
  })

extendConnection.name = 'connection';
EpisodeTC.addResolver(extendConnection);

module.exports = {
  Episode,
  EpisodeTC
}
