import { NEXT_PAGE, PREV_PAGE, SET_ITEMS_PER_PAGE, LOAD_PAGE_INFO } from '../constants/actions'
import { loadAnime } from './anime'
import { Strings } from '../constants/values'

const FetchData = {
  [Strings.anime] : loadAnime
}

const fetchNextPage = () => ({
  type: NEXT_PAGE
})

const fetchPrevPage = () => ({
  type: PREV_PAGE
})

const changePage = (direction, changePage, type, filters) => {
  console.log('%c change page called with => ', 'font-size: 20px; font-weight: bold; color: red;', type, filters);
  return function(dispatch) {
    console.log(`%c change page!! => `, 'color: magenta', dispatch);
    dispatch(FetchData[type](filters, direction));
    dispatch(changePage());
  }
}
export const nextPage = (type, filters) => changePage(Strings.next, fetchNextPage, type, filters);
export const prevPage = (type, filters) => changePage(Strings.prev, fetchPrevPage, type, filters);

export const setItemsPerPage = (event) => ({
  type: SET_ITEMS_PER_PAGE,
  itemsPerPage: event.target.value
})

export const loadPageInfo = (paging) => ({
  type: LOAD_PAGE_INFO,
  paging
})
