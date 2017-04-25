const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const EpisodeSchema = new Schema({
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

module.exports = mongoose.model('Episode', EpisodeSchema);
