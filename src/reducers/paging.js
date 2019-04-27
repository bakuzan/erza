import { createReducer } from './utils';
import {
  SET_ITEMS_PER_PAGE,
  NEXT_PAGE,
  PREV_PAGE,
  RESET_PAGE,
  LOAD_PAGE_INFO
} from 'constants/actions';
import { Strings } from 'constants/values';

const setStateDefaults = (overrides = {}) => ({
  size: 5,
  page: 0,
  pageInfo: {},
  ...overrides
});
const initialState = {
  [Strings.anime]: setStateDefaults(),
  [Strings.manga]: setStateDefaults(),
  [Strings.episode]: setStateDefaults({ size: 25 }),
  [Strings.chapter]: setStateDefaults({ size: 25 })
};

const applyStateUpdates = (state, action) => (updates) => ({
  ...state,
  [action.listType]: {
    ...state[action.listType],
    ...updates
  }
});

const changePage = (state, action) => {
  const typeState = state[action.listType];
  const updateState = applyStateUpdates(state, action);
  switch (action.type) {
    case NEXT_PAGE:
      return updateState({ page: typeState.page + 1 });
    case PREV_PAGE:
      return updateState({ page: typeState.page - 1 });
    case RESET_PAGE:
      return updateState({ page: 0 });
    default:
      return state;
  }
};

const setItemsPerPage = (state, action) => {
  const updateState = applyStateUpdates(state, action);
  return updateState({ size: Number(action.size) });
};

const setPageInfo = (state, action) => {
  const updateState = applyStateUpdates(state, action);
  return updateState({ pageInfo: { ...action.paging } });
};

export const paging = createReducer(initialState, {
  [SET_ITEMS_PER_PAGE]: setItemsPerPage,
  [NEXT_PAGE]: changePage,
  [PREV_PAGE]: changePage,
  [RESET_PAGE]: changePage,
  [LOAD_PAGE_INFO]: setPageInfo
});

// Selectors

export const selectPagingForType = (state, ownProps) =>
  state.paging[ownProps.type || ownProps.listType];
