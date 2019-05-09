const { GraphQLScalarType, Kind } = require('graphql');

const validateHistoryPartition = require('./utils/validateHistoryPartition');

const Query = require('./query');
const Mutation = require('./mutation');
const models = require('./models');

module.exports = {
  ...models,
  Query,
  Mutation,
  HistoryPartition: new GraphQLScalarType({
    name: 'HistoryPartition',
    description: 'Date partial in form YYYY or YYYY-MM',
    serialize: validateHistoryPartition,
    parseValue: validateHistoryPartition,
    parseLiteral(ast) {
      return validateHistoryPartition(ast.value);
    }
  }),
  Date: new GraphQLScalarType({
    name: 'Date',
    description: 'Date custom scalar type',
    parseValue(value) {
      return new Date(value); // value from the client
    },
    serialize(value) {
      return value.getTime(); // value sent to the client
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return new Date(ast.value); // ast value is always in string format
      }

      return null;
    }
  })
};
