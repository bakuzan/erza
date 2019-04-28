import {
  NEXT_PAGE,
  PREV_PAGE,
  RESET_PAGE,
  SET_ITEMS_PER_PAGE,
  LOAD_PAGE_INFO
} from 'constants/actions';
import { Strings } from 'constants/values';
import { loadAnime } from './anime';
import { loadManga } from './manga';
import { loadEpisodesByDateRange, loadEpisodesBySeries } from './episode';
import { loadChaptersByDateRange, loadChaptersBySeries } from './chapter';

const FetchData = (dataType, { seriesId = null }) => {
  switch (dataType) {
    case Strings.anime:
      return loadAnime;
    case Strings.manga:
      return loadManga;
    case Strings.episode:
      return seriesId ? loadEpisodesBySeries : loadEpisodesByDateRange;
    case Strings.chapter:
      return seriesId ? loadChaptersBySeries : loadChaptersByDateRange;
    default:
      return console.log(`No data function found for type: ${dataType}`);
  }
};

export const resetPageToZero = (listType) => ({
  type: RESET_PAGE,
  listType
});

const fetchNextPage = (listType) => ({
  type: NEXT_PAGE,
  listType
});

const fetchPrevPage = (listType) => ({
  type: PREV_PAGE,
  listType
});

const changePage = (direction, changePage, type, filters) => {
  return function(dispatch) {
    dispatch(changePage(type));
    dispatch(FetchData(type, filters)(filters, direction));
  };
};

export const nextPage = (type, filters) =>
  changePage(Strings.next, fetchNextPage, type, filters);

export const prevPage = (type, filters) =>
  changePage(Strings.prev, fetchPrevPage, type, filters);

export const setItemsPerPage = (event, listType) => ({
  type: SET_ITEMS_PER_PAGE,
  size: event.target.value,
  listType
});

export const loadPageInfo = (paging, listType) => ({
  type: LOAD_PAGE_INFO,
  paging,
  listType
});
