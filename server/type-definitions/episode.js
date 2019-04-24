const gql = require('graphql-tag');

module.exports = gql`
  type Episode {
    id: Int
    date: String
    rating: Int
    note: String
    episode: Int
    animeId: Int
    anime: Anime
  }

  type EpisodePage {
    nodes: [Episode]
    total: Int
    hasMore: Boolean
  }
`;
