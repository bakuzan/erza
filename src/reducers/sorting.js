import { TOGGLE_SORT, SET_SORT_KEY } from '../constants/actions'
import {Strings} from '../constants/values'

const setSortOrder = (state, action) => {
  switch(action.type) {
    case TOGGLE_SORT : return action.direction;
    default          : return state;
  }
}

const setSortKey = (state, action) => {
  switch (action.type) {
    case SET_SORT_KEY : return action.key;
    default           : return state;
  }
}

export const sorting = (state = { sortKey: 'updatedDate', sortOrder: Strings.descending }, action) => {
  return {
    sortKey: setSortKey(state.sortKey, action),
    sortOrder: setSortOrder(state.sortOrder, action)
  };
}
