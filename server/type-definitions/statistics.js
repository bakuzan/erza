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
`;
