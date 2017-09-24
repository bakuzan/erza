import fetchFromServer from '../graphql/fetch'
import DailyAnimeQL from '../graphql/query/daily-anime'
import {Paths} from '../constants/paths'
import {Enums} from '../constants/values'
import {startOfDay, endOfDay, dateAsMs} from '../utils/date'
import {
  DAILY_ANIME_LOAD
} from '../constants/actions'



const loadDailyAnime = data => ({
  type: DAILY_ANIME_LOAD,
  data
})

export const fetchDailyAnime = () => {
  return function(dispatch) {
    const date = new Date()
    date.setDate(date.getDate() - 6)

    const dateRange = [dateAsMs(startOfDay(date)), dateAsMs(endOfDay(date))].toString()
    const query = DailyAnimeQL.getDailyAnimeForDateRange(dateRange)
    fetchFromServer(`${Paths.graphql.base}${query}`)
      .then(response => {
        const { episodes: { edges: episodes }, anime } = response.data
        const dailyAnime = episodes
          .map(({ node: item }) => {
            const series = anime.find(x => x._id === item.parent)
            if (!series) return null
            if (item.episode !== series.episode) return null
            if (![Enums.anime.type.tv, Enums.anime.type.ona].some(x => x === series.series_type)) return null

            return item;
          })
          .filter(x => !!x)

        dispatch(loadDailyAnime(dailyAnime));
      })
  }
}
