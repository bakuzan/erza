const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TagSchema = new Schema({
  name: {
    type: String,
    unique: 'Name must be unique.',
    default: '',
    required: 'Please fill in an tag name',
    trim: true
  },
  isAdult: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('Tag', TagSchema);
