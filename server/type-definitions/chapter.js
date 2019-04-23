const gql = require('graphql-tag');

module.exports = gql`
  type Chapter {
    id: Int
    date: String
    rating: Int
    note: String
    isAdult: Boolean
    chapter: Int
    mangaId: Int
    manga: Manga
  }
`;
