import {
  NEXT_PAGE,
  PREV_PAGE,
  RESET_PAGE,
  SET_ITEMS_PER_PAGE,
  LOAD_PAGE_INFO
} from '../constants/actions';
import { loadAnime } from './anime';
import { loadManga } from './manga';
import { loadEpisodesByDateRange } from './episode';
import { loadChaptersByDateRange } from './chapter';
import { Strings } from '../constants/values';

const FetchData = dataType => {
  switch (dataType) {
    case Strings.anime:
      return loadAnime;
    case Strings.manga:
      return loadManga;
    case Strings.episode:
      return loadEpisodesByDateRange;
    case Strings.chapter:
      return loadChaptersByDateRange;
    default:
      return console.log(`No data function found for type: ${dataType}`);
  }
};

export const resetPageToZero = listType => ({
  type: RESET_PAGE,
  listType
});

const fetchNextPage = listType => ({
  type: NEXT_PAGE,
  listType
});

const fetchPrevPage = listType => ({
  type: PREV_PAGE,
  listType
});

const changePage = (direction, changePage, type, filters) => {
  return function(dispatch) {
    dispatch(changePage(type));
    dispatch(FetchData(type)(filters, direction));
  };
};
export const nextPage = (type, filters) =>
  changePage(Strings.next, fetchNextPage, type, filters);
export const prevPage = (type, filters) =>
  changePage(Strings.prev, fetchPrevPage, type, filters);

export const setItemsPerPage = (event, listType) => ({
  type: SET_ITEMS_PER_PAGE,
  itemsPerPage: event.target.value,
  listType
});

export const loadPageInfo = (paging, listType) => ({
  type: LOAD_PAGE_INFO,
  paging,
  listType
});
