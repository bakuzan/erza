import {
  getMangaById,
  getMangaByIdForEdit,
  getMangaPaged
} from 'erzaGQL/query';
import {
  mangaCreate,
  mangaUpdate,
  mangaUpdateWithHistory
} from 'erzaGQL/mutation';

import { loadItems, loadItemsById, mutateItem } from './utils/series';
import { mutateSeriesWithHistory } from './utils/combined';
import { UPDATE_MANGA } from '../constants/actions';
import { Strings } from '../constants/values';

export const createManga = (item) =>
  mutateItem(mangaCreate, item, Strings.manga);

export const editManga = (item) => mutateItem(mangaUpdate, item, Strings.manga);

const updateMangaInState = (item) => ({
  type: UPDATE_MANGA,
  item
});

export const addChapters = ({ editItem }) =>
  mutateSeriesWithHistory(mangaUpdateWithHistory, editItem, {
    type: Strings.manga,
    updateInState: updateMangaInState,
    mapSeries: (item, editItem) => ({
      id: item.id,
      current: editItem.chapter,
      volume: editItem.volume || item.volume,
      rating: editItem.overallRating || item.rating
    })
  });

export const loadManga = (filters = {}, pageChange = null) =>
  loadItems(getMangaPaged, filters, {
    pageChange,
    type: Strings.manga
  });

export const loadMangaById = (id) =>
  loadItemsById(getMangaById, { id }, Strings.manga);

export const loadMangaByIdForEdit = (id) =>
  loadItemsById(getMangaByIdForEdit, { id }, Strings.manga);
