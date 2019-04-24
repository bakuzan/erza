const gql = require('graphql-tag');

module.exports = gql`
  type Chapter {
    id: Int
    date: String
    rating: Int
    note: String
    chapter: Int
    mangaId: Int
    manga: Manga
  }

  type ChapterPage {
    nodes: [Chapter]
    total: Int
    hasMore: Boolean
  }
`;
