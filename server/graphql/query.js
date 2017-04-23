const { ComposeStorage } = require('graphql-compose');
const GQC = new ComposeStorage();

const { AnimeTC } = require('../models/anime');

GQC.rootQuery().addFields({
  animeById: AnimeTC.getResolver('findById'),
  animeByIds: AnimeTC.getResolver('findByIds'),
  animeOne: AnimeTC.getResolver('findOne'),
  animeMany: AnimeTC.getResolver('findMany'),
  animeTotal: AnimeTC.getResolver('count'),
  animeConnection: AnimeTC.getResolver('connection'),
});

GQC.rootMutation().addFields({
  animeCreate: AnimeTC.getResolver('createOne'),
  animeUpdateById: AnimeTC.getResolver('updateById'),
  animeUpdateOne: AnimeTC.getResolver('updateOne'),
  animeUpdateMany: AnimeTC.getResolver('updateMany'),
  animeRemoveById: AnimeTC.getResolver('removeById'),
  animeRemoveOne: AnimeTC.getResolver('removeOne'),
  animeRemoveMany: AnimeTC.getResolver('removeMany'),
});

const GraphqlSchema = GQC.buildSchema();
module.exports = GraphqlSchema;
