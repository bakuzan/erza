import {
  getAnimePaged,
  getAnimeById,
  getAnimeByIdForEdit,
  getAnimeByIdForQuickAdd
} from 'erzaGQL/query';
import {
  animeCreate,
  animeUpdate,
  animeRemove,
  animeUpdateWithHistory
} from 'erzaGQL/mutation';

import {
  loadItems,
  loadItemsById,
  mutateItem,
  mutateStartItem,
  removeItem
} from './utils/series';
import { mutateSeriesWithHistory } from './utils/combined';

import { ANIME_UPDATE } from 'constants/actions';
import { Strings } from 'constants/values';

export const createAnime = (item) =>
  mutateItem(animeCreate, item, Strings.anime);

export const editAnime = (item) => mutateItem(animeUpdate, item, Strings.anime);

export const startAnime = (itemId) =>
  mutateStartItem(animeUpdate, itemId, Strings.anime);

export const deleteAnime = (id) =>
  removeItem(animeRemove, { id }, Strings.anime);

const updateAnimeInState = (item) => ({
  type: ANIME_UPDATE,
  item
});

export const addEpisodes = (editItem, shouldRequery = false) =>
  mutateSeriesWithHistory(
    animeUpdateWithHistory,
    editItem,
    {
      type: Strings.anime,
      updateInState: ({ episode, current, ...obj }) =>
        updateAnimeInState({
          ...obj,
          episode: current || episode
        }),
      mapToInput: (item, editItem = {}) => ({
        id: item.id,
        current: editItem.episode || item.episode,
        rating: editItem.overallRating || item.rating
      })
    },
    shouldRequery ? loadAnimeById : null
  );

export const loadAnime = (filters = {}, pageChange = null) =>
  loadItems(getAnimePaged, filters, {
    pageChange,
    type: Strings.anime
  });

export const loadAnimeById = (id) =>
  loadItemsById(getAnimeById, { id }, Strings.anime);

export const loadAnimeByIdForEdit = (id) =>
  loadItemsById(getAnimeByIdForEdit, { id }, Strings.anime);

export const loadAnimeByIdForQuickAdd = (id) =>
  loadItemsById(getAnimeByIdForQuickAdd, { id }, Strings.anime);
