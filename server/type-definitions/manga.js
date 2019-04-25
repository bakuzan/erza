const gql = require('graphql-tag');

module.exports = gql`
  type Manga {
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
    series_type: MangaType
    series_start: String
    series_end: String
    updatedAt: String
    createdAt: String
    chapter: Int
    volume: Int
    series_chapters: Int
    series_volumes: Int
    tags: [Tag]
    chapters: [Chapter]
  }

  type MangaPage {
    nodes: [Manga]
    total: Int
    hasMore: Boolean
  }
`;
