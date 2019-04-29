const gql = require('graphql-tag');

module.exports = gql`
  interface History {
    id: Int
    date: String
    rating: Int
    note: String
  }

  type Episode implements History {
    id: Int
    date: String
    rating: Int
    note: String
    episode: Int
    animeId: Int
    anime: Anime
  }

  type EpisodePage {
    total: Int
    hasMore: Boolean
    nodes: [Episode]
  }

  type Chapter implements History {
    id: Int
    date: String
    rating: Int
    note: String
    chapter: Int
    mangaId: Int
    manga: Manga
  }

  type ChapterPage {
    total: Int
    hasMore: Boolean
    nodes: [Chapter]
  }

  input HistoryCreateInput {
    number: Int!
    note: String
    rating: Int
  }
  input HistoryInput {
    id: Int!
    note: String
    rating: Int
  }
`;
