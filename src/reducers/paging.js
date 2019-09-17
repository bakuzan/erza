import { createReducer } from './utils';
import {
  SET_ITEMS_PER_PAGE,
  NEXT_PAGE,
  RESET_PAGE,
  LOAD_PAGE_INFO
} from 'constants/actions';
import { Strings } from 'constants/values';
import { userSettings } from 'utils/storage';

const setStateDefaults = (key, pageSize) => ({
  [key]: {
    size: pageSize[key],
    page: 0,
    pageInfo: {}
  }
});

function initialState() {
  const pageSize = userSettings.getKey('pageSize');
  return {
    ...setStateDefaults(Strings.anime, pageSize),
    ...setStateDefaults(Strings.manga, pageSize),
    ...setStateDefaults(Strings.episode, pageSize),
    ...setStateDefaults(Strings.chapter, pageSize)
  };
}

const applyStateUpdates = (state, action) => (updates) => ({
  ...state,
  [action.listType]: {
    ...state[action.listType],
    ...updates
  }
});

function changePage(state, action) {
  const typeState = state[action.listType];
  const updateState = applyStateUpdates(state, action);
  switch (action.type) {
    case NEXT_PAGE:
      return updateState({ page: typeState.page + 1 });
    case RESET_PAGE:
      return updateState({ page: 0 });
    default:
      return state;
  }
}

function setItemsPerPage(state, action) {
  const updateState = applyStateUpdates(state, action);
  const pageSize = userSettings.getKey('pageSize');
  const size = Number(action.size);

  userSettings.set({
    pageSize: {
      ...pageSize,
      [action.listType]: size
    }
  });

  return updateState({ size });
}

function setPageInfo(state, action) {
  const updateState = applyStateUpdates(state, action);
  return updateState({ pageInfo: { ...action.paging } });
}

export const paging = createReducer(initialState(), {
  [SET_ITEMS_PER_PAGE]: setItemsPerPage,
  [NEXT_PAGE]: changePage,
  [RESET_PAGE]: changePage,
  [LOAD_PAGE_INFO]: setPageInfo
});

// Selectors

export const selectPagingForType = (state, ownProps) =>
  state.paging[ownProps.type || ownProps.listType];
