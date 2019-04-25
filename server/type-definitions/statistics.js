const gql = require('graphql-tag');

// TODO flesh out types

module.exports = gql`
  type StatCount {
    key: String
    value: Int
  }
  type StatSeriesRow {
    id: Int
    title: String
    rating: Int
  }
`;
