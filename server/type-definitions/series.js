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
    episode: Int
    series_episodes: Int
    _legacyIsSeason: Boolean
    season: AnimeSeason
    episodes: [Episode]
  }

  type AnimeSeason {
    inSeason: Boolean
    year: Int
    season: String
  }

  type AnimePage {
    total: Int
    hasMore: Boolean
    nodes: [Anime]
  }

  type Manga implements Series {
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
    chapter: Int
    volume: Int
    series_chapters: Int
    series_volumes: Int
    chapters: [Chapter]
  }

  type MangaPage {
    total: Int
    hasMore: Boolean
    nodes: [Manga]
  }

  input SeriesInput {
    id: Int!
    current: Int!
    volume: Int
    rating: Int
  }
  input AnimeCreateInput {
    title: String
    start: String
    end: String
    status: Status
    owned: Boolean
    rating: Int
    isAdult: Boolean
    isRepeat: Boolean
    image: String
    link: String
    malId: Int
    series_type: AnimeType
    series_start: String
    series_end: String
    tags: [TagInput]
    episode: Int
    series_episodes: Int
    _legacyIsSeason: Boolean
  }
  input AnimeInput {
    id: Int!
    title: String
    start: String
    end: String
    status: Status
    owned: Boolean
    rating: Int
    isAdult: Boolean
    isRepeat: Boolean
    image: String
    link: String
    malId: Int
    series_type: AnimeType
    series_start: String
    series_end: String
    tags: [TagInput]
    episode: Int
    series_episodes: Int
    _legacyIsSeason: Boolean
  }

  input MangaCreateInput {
    title: String
    start: String
    end: String
    status: Status
    owned: Boolean
    rating: Int
    isAdult: Boolean
    isRepeat: Boolean
    image: String
    link: String
    malId: Int
    series_type: AnimeType
    series_start: String
    series_end: String
    tags: [TagInput]
    chapter: Int
    volume: Int
    series_chapters: Int
    series_volumes: Int
  }
  input MangaInput {
    id: Int!
    title: String
    start: String
    end: String
    status: Status
    owned: Boolean
    rating: Int
    isAdult: Boolean
    isRepeat: Boolean
    image: String
    link: String
    malId: Int
    series_type: AnimeType
    series_start: String
    series_end: String
    tags: [TagInput]
    chapter: Int
    volume: Int
    series_chapters: Int
    series_volumes: Int
  }
`;
