const { ComposeStorage } = require('graphql-compose');
const GQC = new ComposeStorage();

const { combineArrayOfObjects, constructQueryFields, constructMutationFields } = require('./common');
const { AnimeTC } = require('../models/anime');

const arrayOfModels = [
  { prefix: 'anime', type: AnimeTC }
];

const queries = arrayOfModels.map(constructQueryFields).reduce(combineArrayOfObjects);
const mutations = arrayOfModels.map(constructMutationFields).reduce(combineArrayOfObjects);

GQC.rootQuery().addFields(queries);
GQC.rootMutation().addFields(mutations);

const GraphqlSchema = GQC.buildSchema();
module.exports = GraphqlSchema;
