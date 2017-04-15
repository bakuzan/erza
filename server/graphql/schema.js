const graphql = require('graphql');
const { GraphQLObjectType, GraphQLSchema } = graphql;

const TagQueries = require('./queries/tags.js');

let RootQuery = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    tags: TagQueries.tags
    // user: UserQueries.user,
    // userList: UserQueries.userList
  })
});

module.exports = new GraphQLSchema({
  query: RootQuery
});
