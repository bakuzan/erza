
const getDailyAnimeForDateRange = dateRange => (`
	{
	  episodes: episodeMany(filter: { _operators: { date: { gte: ${dateRange[0]}, lte: ${dateRange[1]} } }, isAdult: false}, sort: DATE_ASC) {
	    _id
	    parent
	    episode
	    series {
	      title
	    }
	  }
	  anime: animeMany(filter: {isAdult: false, status: 1}) {
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
