const { ComposeStorage } = require('graphql-compose');
const GQC = new ComposeStorage();

const {
  combineArrayOfObjects,
  constructQueryFields,
  constructMutationFields
} = require('./common');
const { AnimeTC } = require('../models/anime');
const { MangaTC } = require('../models/manga');
const { TagTC } = require('../models/tag');
const { EpisodeTC } = require('../models/episode');
const { ChapterTC } = require('../models/chapter');
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

GQC.rootQuery().addFields(queries);
GQC.rootMutation().addFields(mutations);

const GraphqlSchema = GQC.buildSchema();
module.exports = GraphqlSchema;
