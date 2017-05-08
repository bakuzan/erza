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
    type: Date
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

module.exports = {
  Episode,
  EpisodeTC
}
