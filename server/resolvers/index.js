const { GraphQLScalarType, Kind } = require('graphql');

const Common = require('../utils');
const validateHistoryPartition = require('./validateHistoryPartition');

const Query = require('./query');
const Mutation = require('./mutation');
const models = require('./models');

const HistoryPartition = new GraphQLScalarType({
  name: 'HistoryPartition',
  description: 'Date partial in form YYYY or YYYY-MM',
  serialize: validateHistoryPartition,
  parseValue: validateHistoryPartition,
  parseLiteral(ast) {
    return validateHistoryPartition(ast.value);
  }
});

module.exports = {
  ...models,
  Query,
  Mutation,
  HistoryPartition
};
