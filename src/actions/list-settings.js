import { TOGGLE_SORT, SET_SORT_KEY, NEXT_PAGE, PREV_PAGE, SET_ITEMS_PER_PAGE, LOAD_PAGE_INFO } from '../constants/actions'

export const toggleSortOrder = (event) => ({
  type: TOGGLE_SORT,
  direction: event.target.value
})

export const setSortKey = (event) => ({
  type: SET_SORT_KEY,
  key: event.target.value
})

export const nextPage = () => ({
  type: NEXT_PAGE
})

export const prevPage = () => ({
  type: PREV_PAGE
})

export const setItemsPerPage = (event) => ({
  type: SET_ITEMS_PER_PAGE,
  itemsPerPage: event.target.value
})

export const loadPageInfo = (paging) => ({
  type: LOAD_PAGE_INFO,
  paging
})
