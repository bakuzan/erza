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

const arrayOfModels = [
  { prefix: 'anime', type: AnimeTC },
  { prefix: 'manga', type: MangaTC },
  { prefix: 'tag', type: TagTC },
  { prefix: 'episode', type: EpisodeTC },
  { prefix: 'chapter', type: ChapterTC }
];

const queries = arrayOfModels
  .map(constructQueryFields)
  .reduce(combineArrayOfObjects);

const mutations = arrayOfModels
  .map(constructMutationFields)
  .reduce(combineArrayOfObjects);

GQC.rootQuery().addFields({
  ...queries,
  animeManyAiring: AnimeTC.getResolver('findManyAiring'),
  animeManyRepeated: AnimeTC.getResolver('findManyRepeated'),
  mangaManyRepeated: MangaTC.getResolver('findManyRepeated'),
  animeCheckIfExists: AnimeTC.getResolver('checkIfExists'),
  mangaCheckIfExists: MangaTC.getResolver('checkIfExists')
});
GQC.rootMutation().addFields(mutations);

const GraphqlSchema = GQC.buildSchema();
module.exports = GraphqlSchema;
