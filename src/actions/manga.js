import update from 'immutability-helper';

import MangaML from '../graphql/mutation/manga';
import {
  getMangaById,
  getMangaByIdForEdit,
  getMangaPaged
} from 'erzaGQL/query';

import { loadItems, loadItemsById, mutateItem } from './utils/series';

import { UPDATE_MANGA } from '../constants/actions';
import { Strings } from '../constants/values';
import updatePrePost from '../utils/validators/mangaPost';
import { mapChapterData } from '../utils/data';

export const createManga = (item) =>
  mutateItem(Strings.manga, item, MangaML.createManga);

export const editManga = (item) =>
  mutateItem(Strings.manga, item, MangaML.updateMangaById);

const updateMangaInState = (item) => ({
  type: UPDATE_MANGA,
  item
});

export const addChapters = ({ editItem }) => {
  return function(dispatch, getState) {
    const manga = getState().entities.manga.byId[editItem.id];
    const updatedManga = update(manga, {
      chapter: { $set: editItem.chapter },
      volume: { $set: editItem.volume || manga.volume },
      rating: { $set: editItem.overallRating || manga.rating }
    });
    dispatch(updateMangaInState(updatedManga));
    const history = mapChapterData(manga, editItem);
    history.forEach((item) => dispatch(createChapter(item)));

    dispatch(editManga(updatePrePost(updatedManga)));
  };
};

export const loadManga = (filters = {}, pageChange = null) =>
  loadItems(getMangaPaged, filters, {
    pageChange,
    type: Strings.manga
  });

export const loadMangaById = (id) =>
  loadItemsById(getMangaById, { id }, Strings.manga);

export const loadMangaByIdForEdit = (id) =>
  loadItemsById(getMangaByIdForEdit, { id }, Strings.manga);
