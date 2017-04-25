const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const AnimeHistorySchema = new Schema({
  parent: {
    type: ObjectId,
    ref: 'Anime'
  },
  episodes:  [{
    type: ObjectId,
    ref: 'Episode'
  }]
});

module.exports = mongoose.model('AnimeHistory', AnimeHistorySchema);
