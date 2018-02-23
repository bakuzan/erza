const { SchemaComposer } = require('graphql-compose');
const GQC = new SchemaComposer();

const {
  combineArrayOfObjects,
  constructQueryFields,
  constructMutationFields
} = require('./common');
const {
  AnimeTC,
  MangaTC,
  EpisodeTC,
  ChapterTC,
  TagTC
} = require('./relation-construction');
const { TaskTC } = require('../models/task');

const arrayOfModels = [
  { prefix: 'anime', type: AnimeTC },
  { prefix: 'manga', type: MangaTC },
  { prefix: 'tag', type: TagTC },
  { prefix: 'episode', type: EpisodeTC },
  { prefix: 'chapter', type: ChapterTC },
  { prefix: 'task', type: TaskTC }
];

const queries = arrayOfModels
  .map(constructQueryFields)
  .reduce(combineArrayOfObjects);

const mutations = arrayOfModels
  .map(constructMutationFields)
  .reduce(combineArrayOfObjects);

GQC.rootQuery().addFields({
  ...queries,
  animeManyRepeated: AnimeTC.getResolver('findManyRepeated'),
  mangaManyRepeated: MangaTC.getResolver('findManyRepeated')
});
GQC.rootMutation().addFields(mutations);

const GraphqlSchema = GQC.buildSchema();
module.exports = GraphqlSchema;
