const gql = require('graphql-tag');

module.exports = gql`
  type StatCount {
    key: String
    value: String
  }
`;
