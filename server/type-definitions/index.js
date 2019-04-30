const gql = require('graphql-tag');

const Series = require('./series');
const History = require('./history');
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
    dailyAnime(dateOffset: Int!): [Anime]

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
      sorting: [String]
    ): ChapterPage
    chaptersForManga(
      seriesId: Int!
      paging: Paging
      sorting: [String]
    ): ChapterPage

    episodes(
      fromDate: String
      toDate: String
      ratings: [Int]
      isAdult: Boolean
      paging: Paging
      sorting: [String]
    ): EpisodePage
    episodesForAnime(
      seriesId: Int!
      paging: Paging
      sorting: [String]
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
    currentSeason(sorting: [String]): [StatSeriesRow]
  }
`;

const Mutation = gql`
  type Mutation {
    animeCreate(payload: AnimeCreateInput!): SeriesResponse
    animeUpdate(payload: AnimeInput!): SeriesResponse
    animeRemove(id: Int!): DeleteResponse

    mangaCreate(payload: MangaCreateInput!): SeriesResponse
    mangaUpdate(payload: MangaInput!): SeriesResponse
    mangaRemove(id: Int!): DeleteResponse

    animeUpdateWithHistory(
      series: SeriesInput!
      history: [HistoryCreateInput]
    ): SeriesResponse
    mangaUpdateWithHistory(
      series: SeriesInput!
      history: [HistoryCreateInput]
    ): SeriesResponse

    episodeUpdate(payload: HistoryInput!): HistoryResponse
    episodeRemove(id: Int!): DeleteResponse

    chapterUpdate(payload: HistoryInput!): HistoryResponse
    chapterRemove(id: Int!): DeleteResponse

    tagUpdate(payload: TagInput!): TagResponse
    tagRemove(id: Int!): DeleteResponse
  }

  type DeleteResponse {
    success: Boolean
    errorMessages: [String]
  }

  type SeriesData {
    id: Int
    title: String
  }

  type SeriesResponse {
    success: Boolean
    errorMessages: [String]
    data: SeriesData
  }

  type HistoryData {
    id: Int
    note: String
    rating: Int
  }

  type HistoryResponse {
    success: Boolean
    errorMessages: [String]
    data: HistoryData
  }

  type TagResponse {
    success: Boolean
    errorMessages: [String]
    data: Tag
  }
`;

module.exports = [
  Query,
  Mutation,
  Series,
  History,
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
