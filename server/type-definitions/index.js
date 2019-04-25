const gql = require('graphql-tag');

const Anime = require('./anime');
const Manga = require('./manga');
const Episode = require('./episode');
const Chapter = require('./chapter');
const Tag = require('./tag');
const Statistics = require('./statistics');
const Enums = require('./enums');

const Query = gql`
  scalar HistoryPartition

  type Query {
    animeById(id: Int!): Anime
    animePaged(
      search: String
      status: [Status]
      isOwnedOnly: Boolean
      isAdult: Boolean
      sorting: [String]
      paging: Paging
    ): AnimePage
    animeExists(id: Int, malId: Int, title: String): Boolean
    animeRepeated(
      search: String
      minTimesCompleted: Int
      isAdult: Boolean
    ): [Anime]
    dailyAnime(date: String!): [Anime]

    mangaById(id: Int!): Manga
    mangaPaged(
      search: String
      status: [Status]
      isOwnedOnly: Boolean
      isAdult: Boolean
      sorting: [String]
      paging: Paging
    ): MangaPage
    mangaExists(id: Int, malId: Int, title: String): Boolean
    mangaRepeated(
      search: String
      minTimesCompleted: Int
      isAdult: Boolean
    ): [Manga]

    chapters(
      fromDate: String
      toDate: String
      ratings: [Int]
      isAdult: Boolean
      paging: Paging
    ): ChapterPage
    episodes(
      fromDate: String
      toDate: String
      ratings: [Int]
      isAdult: Boolean
      paging: Paging
    ): EpisodePage

    tagById(id: Int!): Tag
    tags(search: String, isAdult: Boolean): [Tag]

    statsStatusCounts(type: StatType, isAdult: Boolean): [StatCount]
    statsRatingCounts(type: StatType, isAdult: Boolean): [StatCount]
    statsHistoryCounts(
      type: StatType
      isAdult: Boolean
      breakdown: StatBreakdown
    ): [StatCount]
    statsHistoryDetail(
      type: StatType
      isAdult: Boolean
      breakdown: StatBreakdown
      partition: HistoryPartition
    ): [StatSeriesRow]
    statsHistoryDetailYear(
      type: StatType
      isAdult: Boolean
      breakdown: StatBreakdown
      partition: HistoryPartition
    ): [StatSeriesRow]

    currentSeason: [Anime]
  }
`;

const Mutation = gql`
  type Mutation {
    noop: Boolean
  }
`;

module.exports = [
  Query,
  Mutation,
  Anime,
  Manga,
  Episode,
  Chapter,
  Tag,
  Statistics,
  Enums,
  gql`
    input Paging {
      size: Int
      page: Int
    }
  `
];
