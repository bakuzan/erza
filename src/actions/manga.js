import update from 'immutability-helper';
import MangaQL from '../graphql/query/manga';
import MangaML from '../graphql/mutation/manga';
import { loadItems, loadItemsById, mutateItem } from './list-items';
import { createChapter } from './chapter';
import { UPDATE_MANGA } from '../constants/actions';
import { Strings } from '../constants/values';
import updatePrePost from '../utils/validators/manga-post';
import { mapChapterData } from '../utils/data';

export const createManga = item =>
  mutateItem(Strings.manga, item, MangaML.createManga);

export const editManga = item =>
  mutateItem(Strings.manga, item, MangaML.updateMangaById);

const updateMangaInState = item => ({
  type: UPDATE_MANGA,
  item
});

export const addChapters = ({ editItem }) => {
  return function(dispatch, getState) {
    const manga = getState().entities.manga.byId[editItem._id];
    const updatedManga = update(manga, {
      chapter: { $set: editItem.chapter },
      volume: { $set: editItem.volume || manga.volume },
      rating: { $set: editItem.overallRating || manga.rating }
    });
    dispatch(updateMangaInState(updatedManga));
    const history = mapChapterData(manga, editItem);
    history.forEach(item => dispatch(createChapter(item)));

    return updatePrePost(updatedManga).then(updatedItem =>
      dispatch(editManga(updatedItem))
    );
  };
};

export const loadManga = (filters = {}, pageChange = null) =>
  loadItems(
    {
      pageChange,
      filters,
      type: Strings.manga
    },
    MangaQL.getFilteredList
  );

export const loadMangaById = (id, type = 'getById') =>
  loadItemsById(Strings.manga, MangaQL[type](id));
