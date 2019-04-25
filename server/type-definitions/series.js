const gql = require('graphql-tag');

module.exports = gql`
  interface Series {
    id: Int
    title: String
    start: String
    end: String
    status: Status
    owned: Boolean
    rating: Int
    isAdult: Boolean
    isRepeat: Boolean
    timesCompleted: Int
    image: String
    link: String
    malId: Int
    series_type: AnimeType
    series_start: String
    series_end: String
    updatedAt: String
    createdAt: String
    tags: [Tag]
  }

  type Anime implements Series {
    episode: Int
    series_episodes: Int
    _legacyIsSeason: Boolean
    season: AnimeSeason
    tags: [Tag]
    episodes: [Episode]
  }

  type AnimeSeason {
    inSeason: Boolean
    year: Int
    season: String
  }

  type AnimePage implements PageResponse {
    nodes: [Anime]
  }

  type Manga implements Series {
    chapter: Int
    volume: Int
    series_chapters: Int
    series_volumes: Int
    tags: [Tag]
    chapters: [Chapter]
  }

  type MangaPage implements PageResponse {
    nodes: [Manga]
  }
`;
