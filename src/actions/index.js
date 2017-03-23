import { ADD_ANIME, UPDATE_ANIME, ANIME_REQUEST, ANIME_SUCCESS } from '../constants/actions'
import { browserHistory } from 'react-router'
import {Paths} from '../constants/paths'
import {Strings} from '../constants/values'

const redirectPostAction = () => browserHistory.push(`${Paths.base}${Paths.anime.list}${Strings.filters.ongoing}`);

let testId = 0;
const getTestId = () => {
  return testId++;
}

export const startingAnimeRequest = () => ({
  type: ANIME_REQUEST,
  isFetching: true
})

export const finishAnimeRequest = () => ({
  type: ANIME_SUCCESS,
  isFetching: false
})

export const addAnime = (item) => ({
  type: ADD_ANIME,
  item
})

export const createAnime = (item) => {
  console.log(item);
  return function(dispatch) {
    dispatch(startingAnimeRequest());
    item.id = getTestId();
    var goToNext = Promise.resolve(item);
    setTimeout(() => {
      goToNext.then(response => {
        dispatch(addAnime(response));
        dispatch(finishAnimeRequest());
        return redirectPostAction();
      })
    }, 1000);
  }
}

export const updateAnime = (item) => ({
  type: UPDATE_ANIME,
  item
})

export const editAnime = (item) => {
  console.log(item);
  return function(dispatch) {
    dispatch(startingAnimeRequest());
    dispatch(updateAnime(item)).then(response => {
      setTimeout(() => {
        dispatch(finishAnimeRequest());
        return redirectPostAction();
      }, 1000)
    });
  }
}
