import {
  SET_ITEMS_PER_PAGE,
  NEXT_PAGE,
  PREV_PAGE,
  RESET_PAGE,
  LOAD_PAGE_INFO
} from '../constants/actions';
import {
  getUserSettings,
  persistUserSettings,
  parseIfInt
} from '../utils/common';

const changePage = (state, action) => {
  switch (action.type) {
    case NEXT_PAGE:
      return state + 1;
    case PREV_PAGE:
      return state - 1;
    case RESET_PAGE:
      return 0;
    default:
      return state;
  }
};

const initialPageSizes = { anime: 5, manga: 5, episode: 25, chapter: 25 };
const getUserItemsPerPage = () => {
  const settings = getUserSettings();
  if (!settings || !settings.itemsPerPage) return initialPageSizes;
  return { ...initialPageSizes, ...settings.itemsPerPage };
};

const persistItemsPerPageChoice = (state, action) => {
  const updatedSettings = persistUserSettings({
    itemsPerPage: {
      ...state,
      [action.listType]: parseIfInt(action.itemsPerPage)
    }
  });
  return updatedSettings.itemsPerPage;
};

const setItemsPerPage = (state, action) => {
  switch (action.type) {
    case SET_ITEMS_PER_PAGE:
      return persistItemsPerPageChoice(state, action);
    default:
      return state;
  }
};

const setPageInfo = (state, action) => {
  if (action.type !== LOAD_PAGE_INFO) return state;
  return { totalCount: action.paging.count };
};

export const paging = (
  state = { itemsPerPage: getUserItemsPerPage(), page: 0, pageInfo: {} },
  action
) => {
  return {
    itemsPerPage: setItemsPerPage(state.itemsPerPage, action),
    page: changePage(state.page, action),
    pageInfo: setPageInfo(state.pageInfo, action)
  };
};
