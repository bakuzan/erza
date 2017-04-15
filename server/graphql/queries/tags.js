const graphql = require('graphql');
const { GraphQLObjectType, GraphQLList } = graphql;

const Common = require('../../utils/common.js');
const Tag = require('../../models/tag.js');
const TagType = require('../types/tag.js');

const tags = new GraphQLObjectType({
  name: 'Query',
  fields: function () {
    return {
      tags: {
        type: new GraphQLList(TagType),
        resolve: function () {
          return new Promise((resolve, reject) => {
            Tag.find({}).exec((err, tags) => {
              if (err) reject(Common.handleErrorResponse(err, res));
              else resolve(tags);
            })
          });
        }
      }
    }
  }
});

const TagsQueries = {
  tags
}

module.exports = TagsQueries;
