const gql = require('graphql-tag');

module.exports = gql`
  type Episode {
    id: Int
    date: String
    rating: Int
    note: String
    isAdult: Boolean
    episode: Int
    animeId: Int
    anime: Anime
  }
`;
