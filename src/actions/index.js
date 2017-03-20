import { ADD_ANIME, UPDATE_ANIME } from '../constants/actions'
import { browserHistory } from 'react-router'
import {Paths} from '../constants/paths'
import {Strings} from '../constants/strings'

const redirectPostAction = () => browserHistory.push(`${Paths.base}${Paths.anime.list}${Strings.filters.ongoing}`);

export const addAnime = (item) => ({
  type: ADD_ANIME,
  item
})

export const createAnime = (item) => {
  console.log(item);
  return function(dispatch) {
    dispatch(addAnime(item));
    return redirectPostAction();
  }
}

export const updateAnime = (item) => ({
  type: UPDATE_ANIME,
  item
})

export const editAnime = (item) => {
  console.log(item);
  return function(dispatch) {
    dispatch(updateAnime(item));
    return redirectPostAction();
  }
}
