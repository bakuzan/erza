import { TOGGLE_SORT, SET_SORT_KEY } from '../constants/actions'

export const toggleSortOrder = (event) => ({
  type: TOGGLE_SORT,
  direction: event.target.value
})

export const setSortKey = (event) => ({
  type: SET_SORT_KEY,
  key: event.target.value
})
