const gql = require('graphql-tag');

const Anime = require('./anime');
const Manga = require('./manga');
const Episode = require('./episode');
const Chapter = require('./chapter');
const Tag = require('./tag');

const Query = gql`
  type Query {
    animeById(id: Int!): Anime

    mangaById(id: Int!): Manga

    tagById(id: Int!): Tag
  }
`;

const Mutation = gql`
  type Mutation {

  }
`;

module.exports = [Query, Mutation, Anime, Manga, Episode, Chapter, Tag];
