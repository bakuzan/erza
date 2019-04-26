import { TOGGLE_SORT, SET_SORT_KEY } from '../constants/actions';
import { Strings } from '../constants/values';

export const sorting = (state = ['updatedAt', Strings.descending], action) => {
  switch (action.type) {
    case TOGGLE_SORT:
      return [state[0], action.direction];
    case SET_SORT_KEY:
      return [action.key, state[1]];
    default:
      return state;
  }
};
