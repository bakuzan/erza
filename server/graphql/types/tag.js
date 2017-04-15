const graphql = require('graphql');
const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLBoolean
} = graphql;

const TagType = new GraphQLObjectType({
  name: 'tag',
  fields: function () {
    return {
      id: {
        type: GraphQLID
      },
      name: {
        type: GraphQLString
      },
      isAdult: {
        type: GraphQLBoolean
      }
    }
  }
});

module.exports = TagType;
