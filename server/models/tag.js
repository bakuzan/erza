const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const { composeWithMongoose } = require('graphql-compose-mongoose');

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

const Tag = mongoose.model('Tag', TagSchema);
const TagTC = composeWithMongoose(Tag);

const linkedSeriesRelation = (name, seriesType) =>
  TagTC.addRelation(name, () => ({
    resolver: seriesType.getResolver('findMany'),
    args: {
      filter: source => ({
        tags: `${source._id}`
      })
    },
    projection: { _id: 1 }
  }));

module.exports = {
  Tag,
  TagTC,
  linkedSeriesRelation
};
