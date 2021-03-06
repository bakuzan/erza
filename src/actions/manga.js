import {
  getMangaById,
  getMangaByIdForEdit,
  getMangaByIdForQuickAdd,
  getMangaPaged
} from 'erzaGQL/query';
import {
  mangaCreate,
  mangaUpdate,
  mangaRemove,
  mangaUpdateWithHistory
} from 'erzaGQL/mutation';

import {
  loadItems,
  loadItemsById,
  mutateItem,
  mutateStartItem,
  removeItem
} from './utils/series';
import { mutateSeriesWithHistory } from './utils/combined';
import { MANGA_UPDATE } from '../constants/actions';
import { Strings } from '../constants/values';

export const createManga = (item) =>
  mutateItem(mangaCreate, item, Strings.manga);

export const editManga = (item) => mutateItem(mangaUpdate, item, Strings.manga);

export const startManga = (itemId) =>
  mutateStartItem(mangaUpdate, itemId, Strings.manga);

export const deleteManga = (id) =>
  removeItem(mangaRemove, { id }, Strings.manga);

const updateMangaInState = (item) => ({
  type: MANGA_UPDATE,
  item
});

export const addChapters = (editItem, shouldRequery = false) =>
  mutateSeriesWithHistory(
    mangaUpdateWithHistory,
    editItem,
    {
      type: Strings.manga,
      updateInState: ({ chapter, current, ...obj }) =>
        updateMangaInState({
          ...obj,
          chapter: current || chapter
        }),
      mapToInput: (item, editItem = {}) => ({
        id: item.id,
        current: editItem.chapter || item.chapter,
        volume: editItem.volume || item.volume,
        rating: editItem.overallRating || item.rating
      })
    },
    shouldRequery ? loadMangaById : null
  );

export const loadManga = (filters = {}, pageChange = null) =>
  loadItems(getMangaPaged, filters, {
    pageChange,
    type: Strings.manga
  });

export const loadMangaById = (id) =>
  loadItemsById(getMangaById, { id }, Strings.manga);

export const loadMangaByIdForEdit = (id) =>
  loadItemsById(getMangaByIdForEdit, { id }, Strings.manga);

export const loadMangaByIdForQuickAdd = (id) =>
  loadItemsById(getMangaByIdForQuickAdd, { id }, Strings.manga);
