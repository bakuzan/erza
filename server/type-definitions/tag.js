const gql = require('graphql-tag');

module.exports = gql`
  type Tag {
    id: Int
    name: String
    isAdult: Boolean
    anime: [Anime]
    manga: [Manga]
  }

  input TagInput {
    id: Int!
    name: String
    isAdult: Boolean
  }
`;
