const {getSchema} = require('@risingstack/graffiti-mongoose');

const fetchMe = require('./fetch.js');
const Common = require('../../utils/common.js');
const Query = require('./query');
const Tag = require('../../models/tag.js');

const options = {
  mutation: false, // mutation fields can be disabled
  allowMongoIDMutation: false // mutation of mongo _id can be enabled
};
const schema = getSchema([Tag], options);

const TagController = {
  getAllTags: (req, res) => {
    return fetchMe(res, schema, Query.tags.getAll);
  }
};

module.exports = TagController;
