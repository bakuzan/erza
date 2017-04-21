import { TOGGLE_SORT, SET_SORT_KEY, NEXT_PAGE, PREV_PAGE, SET_ITEMS_PER_PAGE, LOAD_PAGE_INFO } from '../constants/actions'
import { loadAnime } from './anime'
import { Strings } from '../constants/values'

const FetchData = {
  [Strings.anime] : loadAnime
}

export const toggleSortOrder = (event) => ({
  type: TOGGLE_SORT,
  direction: event.target.value
})

export const setSortKey = (event) => ({
  type: SET_SORT_KEY,
  key: event.target.value
})

const fetchNextPage = () => ({
  type: NEXT_PAGE
})

const fetchPrevPage = () => ({
  type: PREV_PAGE
})

const changePage = (direction, changePage) => (type, filters) => {
    return function(dispatch) {
      dispatch(fetchData[type](filters, direction));
      dispatch(changePage());
    }
}
export const nextPage = (type, filters) => changePage(Strings.next, fetchNextPage);
export const prevPage = (type, filters) => changePage(Strings.prev, fetchPrevPage);

export const setItemsPerPage = (event) => ({
  type: SET_ITEMS_PER_PAGE,
  itemsPerPage: event.target.value
})

export const loadPageInfo = (paging) => ({
  type: LOAD_PAGE_INFO,
  paging
})
