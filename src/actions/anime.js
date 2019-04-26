import {
  getAnimePaged,
  getAnimeById,
  getAnimeByIdForEdit
} from 'erzaGQL/query';
import {
  animeCreate,
  animeUpdate,
  animeUpdateWithHistory
} from 'erzaGQL/mutation';

import { loadItems, loadItemsById, mutateItem } from './utils/series';
import { mutateSeriesWithHistory } from './utils/combined';

import { UPDATE_ANIME } from 'constants/actions';
import { Strings } from 'constants/values';

export const createAnime = (item) =>
  mutateItem(animeCreate, item, Strings.anime);

export const editAnime = (item) => mutateItem(animeUpdate, item, Strings.anime);

const updateAnimeInState = (item) => ({
  type: UPDATE_ANIME,
  item
});

export const addEpisodes = ({ editItem }) =>
  mutateSeriesWithHistory(animeUpdateWithHistory, editItem, {
    type: Strings.anime,
    updateInState: updateAnimeInState,
    mapSeries: (item, editItem) => ({
      id: item.id,
      current: editItem.episode,
      rating: editItem.overallRating || item.rating
    })
  });

export const loadAnime = (filters = {}, pageChange = null) =>
  loadItems(getAnimePaged, filters, {
    pageChange,
    type: Strings.anime
  });

export const loadAnimeById = (id) =>
  loadItemsById(getAnimeById, { id }, Strings.anime);

export const loadAnimeByIdForEdit = (id) =>
  loadItemsById(getAnimeByIdForEdit, { id }, Strings.anime);
