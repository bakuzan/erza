import { GRAPHQL_REQUEST, GRAPHQL_SUCCESS } from '../constants/actions';

const resolveRequest = (state, action) => false;
const launchRequest = (state, action) => true;

export const isFetching = (state = false, action) => {
  switch (action.type) {
    case GRAPHQL_REQUEST:
      return launchRequest(state, action);
    case GRAPHQL_SUCCESS:
      return resolveRequest(state, action);
    default:
      return state;
  }
};
