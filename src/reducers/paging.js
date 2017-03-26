import { SET_ITEMS_PER_PAGE, NEXT_PAGE, PREV_PAGE } from '../constants/actions'
// import {Strings} from '../constants/values'

const changePage = (state, action) => {
  switch(action.type) {
    case NEXT_PAGE : return state + 1;
    case PREV_PAGE : return state - 1;
    default        : return state;
  }
}

const setItemsPerPage = (state, action) => {
  switch (action.type) {
    case SET_ITEMS_PER_PAGE : return action.itemsPerPage;
    default                 : return state;
  }
}

export const paging = (state = { itemsPerPage: 5, page: 0 }, action) => {
  return {
    itemsPerPage: setItemsPerPage(state.itemsPerPage, action),
    page: changePage(state.page, action)
  };
}
