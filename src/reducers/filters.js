import { FILTERS_TOGGLE_IS_OWNED_ONLY } from '../constants/actions';
import { Strings } from '../constants/values';
import { createReducer } from './utils';

const defaultFilters = {
  isOwnedOnly: false
};

const initialState = {
  [Strings.anime]: { ...defaultFilters },
  [Strings.manga]: { ...defaultFilters }
};

const toggleFilterByProperty = property => (state, action) => {
  const { listType } = action;
  const currentFilters = state[listType];
  return {
    ...state,
    [listType]: {
      ...currentFilters,
      [property]: !currentFilters[property]
    }
  };
};

const filters = createReducer(initialState, {
  [FILTERS_TOGGLE_IS_OWNED_ONLY]: toggleFilterByProperty('isOwnedOnly')
});

export default filters;
