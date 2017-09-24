
const getDailyAnimeForDateRange = dateRange => (`
  {
    episodes: episodeConnection(filter: {
      dateRange: [${dateRange}],
      isAdult: false
    }, sort: DATE_ASC) {
      count
      edges {
        node {
          _id
          parent
          episode
          series {
            title
          }
        }
      }
    }
    anime: animeMany(filter: { isAdult: false, status: 1 }) {
      _id
      title
      episode
      series_type
    }
  }
`)

const DailyAnimeQl = {
  getDailyAnimeForDateRange
};

export default DailyAnimeQl
