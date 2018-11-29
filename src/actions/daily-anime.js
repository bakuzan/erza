import { Utils } from 'meiko';
import fetchFromServer from '../graphql/fetch';
import DailyAnimeQL from '../graphql/query/daily-anime';
import { Paths } from '../constants/paths';
import { Enums } from '../constants/values';
import { DAILY_ANIME_LOAD } from '../constants/actions';

const { startOfDay, endOfDay, DateFormat } = Utils.Date;

const loadDailyAnime = (data) => ({
  type: DAILY_ANIME_LOAD,
  data
});

export const fetchDailyAnime = (dateOffset) => {
  return function(dispatch) {
    const date = new Date();
    date.setDate(date.getDate() - dateOffset);

    const dateRange = [
      DateFormat.dateAsMs(startOfDay(date)),
      DateFormat.dateAsMs(endOfDay(date))
    ];
    const query = DailyAnimeQL.getDailyAnimeForDateRange(dateRange);
    fetchFromServer(`${Paths.graphql.base}${query}`).then((response) => {
      const { episodes, anime } = response.data;
      const dailyAnime = episodes
        .map((item) => {
          const series = anime.find((x) => x._id === item.parent);
          if (!series) return null;
          if (item.episode !== series.episode) return null;
          if (
            ![Enums.anime.type.tv, Enums.anime.type.ona].some(
              (x) => x === series.series_type
            )
          )
            return null;

          return item;
        })
        .filter((x) => !!x);

      dispatch(loadDailyAnime(dailyAnime));
    });
  };
};
