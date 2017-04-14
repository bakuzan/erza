import { SET_ITEMS_PER_PAGE, NEXT_PAGE, PREV_PAGE } from '../constants/actions'
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

export const paging = (state = { itemsPerPage: getUserItemsPerPage(), page: 0 }, action) => {
  return {
    itemsPerPage: setItemsPerPage(state.itemsPerPage, action),
    page: changePage(state.page, action)
  };
}
