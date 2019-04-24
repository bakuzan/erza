const gql = require('graphql-tag');

module.exports = gql`
  type Anime {
    id: Int
    title: String
    start: String
    end: String
    "Status values are 1 / ongoing, 2 / completed, 3 / onhold, 4 / dropped, 6 / planned"
    status: Int
    owned: Boolean
    rating: Int
    isAdult: Boolean
    isRepeat: Boolean
    timesCompleted: Int
    image: String
    link: String
    malId: Int
    series_type: Int
    series_start: String
    series_end: String
    updatedAt: String
    createdAt: String
    episode: Int
    series_episodes: Int
    _legacyIsSeason: Boolean
    season: AnimeSeason
    tags: [Tag]
  }

  type AnimeSeason {
    inSeason: Boolean
    year: Int
    season: String
  }

  type AnimePage {
    nodes: [Anime]
    total: Int
    hasMore: Boolean
  }
`;
