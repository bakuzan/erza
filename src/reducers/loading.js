import { ANIME_REQUEST, ANIME_SUCCESS, TAGS_REQUEST, TAGS_SUCCESS } from '../constants/actions'

const resolveRequest = (state, action) => {
  return false;
}

const launchRequest = (state, action) => {
  return true;
}

export const isFetching = (state = false, action) => {
  switch(action.type) {
    case ANIME_REQUEST:
    case TAGS_REQUEST:
      return launchRequest;
    case ANIME_SUCCESS:
    case TAGS_SUCCESS:
      return resolveRequest;
    default:
      return state;
  }
};
