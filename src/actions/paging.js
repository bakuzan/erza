import { NEXT_PAGE, PREV_PAGE, RESET_PAGE, SET_ITEMS_PER_PAGE, LOAD_PAGE_INFO } from '../constants/actions'
import { loadAnime } from './anime'
import { loadManga } from './manga'
import { loadEpisodesByDateRange } from './episode'
import { loadChaptersByDateRange } from './chapter'
import { Strings } from '../constants/values'

const FetchData = {
  [Strings.anime]   : loadAnime,
  [Strings.manga]   : loadManga,
  [Strings.episode] : loadEpisodesByDateRange,
  [Strings.chapter] : loadChaptersByDateRange
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
  return function(dispatch) {
    dispatch(changePage());
    dispatch(FetchData[type](filters, direction));
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
