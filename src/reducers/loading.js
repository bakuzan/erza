import {
  GRAPHQL_REQUEST, GRAPHQL_SUCCESS,
  TAGS_REQUEST, TAGS_SUCCESS
} from '../constants/actions'

const resolveRequest = (state, action) => false;
const launchRequest = (state, action) => true;

export const isFetching = (state = false, action) => {
  switch(action.type) {
    case GRAPHQL_REQUEST:
    case TAGS_REQUEST:
      return launchRequest(state, action);
    case GRAPHQL_SUCCESS:
    case TAGS_SUCCESS:
      return resolveRequest(state, action);
    default:
      return state;
  }
};
