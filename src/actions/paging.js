import { NEXT_PAGE, PREV_PAGE, RESET_PAGE, SET_ITEMS_PER_PAGE, LOAD_PAGE_INFO } from '../constants/actions'
import { loadAnime } from './anime'
import { loadEpisodesByDateRange } from './episode'
import { Strings } from '../constants/values'

const FetchData = {
  [Strings.anime]   : loadAnime,
  [Strings.history] : loadEpisodesByDateRange
}

export const resetPageToZero = () => ({
  type: RESET_PAGE
})

const fetchNextPage = () => ({
  type: NEXT_PAGE
})

const fetchPrevPage = () => ({
  type: PREV_PAGE
})

const changePage = (direction, changePage, type, filters) => {
  console.log('%c change page called with => ', 'font-size: 20px; font-weight: bold; color: red;', type, filters, direction);
  return function(dispatch) {
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
