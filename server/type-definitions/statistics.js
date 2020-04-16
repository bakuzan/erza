const gql = require('graphql-tag');

module.exports = gql`
  type StatCount {
    key: String
    value: Int
  }

  type StatSeriesRow {
    id: Int!
    title: String!
    rating: Int!
    season: String
    average: Float
    highest: Int
    lowest: Int
    mode: Int
  }

  type SummaryCount {
    key: String
    average: Float
    highest: Int
    lowest: Int
    mode: Int
  }

  type HistoryDetailYear {
    summary: [SummaryCount]
    series: [StatSeriesRow]
  }

  type TagStat {
    id: Int!
    name: String!
    timesUsed: Int
    averageRating: String
  }

  type TagGraphNode {
    id: Int!
    label: String!
    value: Int
    title: String
  }

  type TagGraphEdge {
    from: Int!
    to: Int!
    value: Int
    title: String
  }

  type TagGraph {
    nodes: [TagGraphNode]
    edges: [TagGraphEdge]
  }

  type SeasonAnime {
    id: Int
    title: String
    image: String
    malId: Int
    rating: Int
    totalEpisodes: Int
    season: AnimeSeason
  }

  type SeasonEpisode {
    id: Int
    date: String
    episode: Int
    animeId: Int
    rating: Int
  }

  type SeasonAnimeEpisodes {
    episodeCount: Int
    seriesCount: Int
    season: String
    series: [SeasonAnime]
    episodes: [SeasonEpisode]
  }
`;
