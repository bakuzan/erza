import erzaGQL from 'erzaGQL';
import { getDailyAnime } from 'erzaGQL/query';
import { DAILY_ANIME_LOAD } from '../constants/actions';

const loadDailyAnime = (data) => ({
  type: DAILY_ANIME_LOAD,
  data
});

export const fetchDailyAnime = (dateOffset) => {
  return async function(dispatch) {
    const response = await erzaGQL({
      query: getDailyAnime,
      variables: { dateOffset }
    });
    const data = response.dailyAnime || [];
    dispatch(loadDailyAnime(data));
  };
};
