const gql = require('graphql-tag');

const { StatTypes, StatBreakdowns } = require('../constants/enums');

const mapArrToGraphqlString = (arr) => arr.join(' ');

module.exports = gql`
  enum StatType {
    ${mapArrToGraphqlString(StatTypes)}
  }
  enum StatBreakdown {
    ${mapArrToGraphqlString(StatBreakdowns)}
  }
`;
