import { createReducer } from './utils';
import {
  SET_ITEMS_PER_PAGE,
  NEXT_PAGE,
  RESET_PAGE,
  LOAD_PAGE_INFO,
  ANIME_REMOVE,
  MANGA_REMOVE,
  CHAPTER_REMOVE,
  EPISODE_REMOVE
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

const reducePageItemTotal = (listType) => (state) => {
  const listState = state[listType];
  const updateState = applyStateUpdates(state, {
    listType
  });

  return updateState({
    pageInfo: { ...listState.pageInfo, total: listState.pageInfo.total - 1 }
  });
};

export const paging = createReducer(initialState(), {
  [SET_ITEMS_PER_PAGE]: setItemsPerPage,
  [NEXT_PAGE]: changePage,
  [RESET_PAGE]: changePage,
  [LOAD_PAGE_INFO]: setPageInfo,
  // on remove entity
  [ANIME_REMOVE]: reducePageItemTotal(Strings.anime),
  [MANGA_REMOVE]: reducePageItemTotal(Strings.manga),
  [CHAPTER_REMOVE]: reducePageItemTotal(Strings.chapter),
  [EPISODE_REMOVE]: reducePageItemTotal(Strings.episode)
});

// Selectors

export const selectPagingForType = (state, ownProps) =>
  state.paging[ownProps.type || ownProps.listType];
