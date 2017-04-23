import { SET_ITEMS_PER_PAGE, NEXT_PAGE, PREV_PAGE, LOAD_PAGE_INFO } from '../constants/actions'
import {getUserSettings, persistUserSettings} from '../utils/common'

const changePage = (state, action) => {
  switch(action.type) {
    case NEXT_PAGE : return state + 1;
    case PREV_PAGE : return state - 1;
    default        : return state;
  }
}

const getUserItemsPerPage = () => {
  const settings = getUserSettings();
  if (!settings || !settings.itemsPerPage) return 5;
  return settings.itemsPerPage;
}

const persistItemsPerPageChoice = (state, action) => {
  persistUserSettings({ itemsPerPage: action.itemsPerPage });
  return action.itemsPerPage;
}

const setItemsPerPage = (state, action) => {
  switch (action.type) {
    case SET_ITEMS_PER_PAGE : return persistItemsPerPageChoice(state, action);
    default                 : return state;
  }
}

const setPageInfo = (state, action) => {
  if (action.type !== LOAD_PAGE_INFO) return state;
  const { pageInfo, count } = action.paging;
  return {
    totalCount: count,
    hasNextPage: pageInfo.hasNextPage,
    hasPrevPage: pageInfo.hasPreviousPage,
    backFrom: pageInfo.startCursor,
    forwardFrom: pageInfo.endCursor
  };
}

export const paging = (state = { itemsPerPage: getUserItemsPerPage(), page: 0, pageInfo: {} }, action) => {
  return {
    itemsPerPage: setItemsPerPage(state.itemsPerPage, action),
    page: changePage(state.page, action),
    pageInfo: setPageInfo(state.pageInfo, action)
  };
}
