const gql = require('graphql-tag');

module.exports = gql`
  type Manga {
    id: Int
    title: String
    start: String
    end: String
    "Values: 1 / ongoing, 2 / completed, 3 / onhold, 4 / dropped, 6 / planned"
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
    chapter: Int
    volume: Int
    series_chapters: Int
    series_volumes: Int
    tags: [Tag]
  }

  type MangaPage {
    nodes: [Manga]
    total: Int
    hasMore: Boolean
  }
`;
