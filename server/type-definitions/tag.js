const gql = require('graphql-tag');

module.exports = gql`
  type Tag {
    id: Int
    name: String
    isAdult: Boolean
    anime(sorting: SeriesSorting): [Anime]
    manga(sorting: SeriesSorting): [Manga]
  }

  input SeriesSorting {
    field: SeriesSortField
    order: SortOrder!
  }

  input TagInput {
    id: Int!
    name: String
    isAdult: Boolean
  }
`;
