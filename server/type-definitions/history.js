const gql = require('graphql-tag');

module.exports = gql`
  interface History {
    id: Int
    date: String
    rating: Int
    note: String
  }

  type Episode implements History {
    episode: Int
    animeId: Int
    anime: Anime
  }

  type EpisodePage implements PageResponse {
    nodes: [Episode]
  }

  type Chapter implements History {
    chapter: Int
    mangaId: Int
    manga: Manga
  }

  type ChapterPage implements PageResponse {
    nodes: [Chapter]
  }
`;
