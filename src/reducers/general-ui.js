import { ANIME_REQUEST, ANIME_SUCCESS } from '../constants/actions'
import { createReducer } from './utils'

const resolveRequest = (state, action) => {
  return false;
}

const launchRequest = (state, action) => {
  return true;
}

export const isFetching = createReducer(false, {
    [ANIME_REQUEST] : launchRequest,
    [ANIME_SUCCESS] : resolveRequest
});
