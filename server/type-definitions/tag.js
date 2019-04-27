const gql = require('graphql-tag');

module.exports = gql`
  type Tag {
    id: Int
    name: String
    isAdult: Boolean
    anime(sorting: [String]): [Anime]
    manga(sorting: [String]): [Manga]
  }

  input TagInput {
    id: Int!
    name: String
    isAdult: Boolean
  }
`;
