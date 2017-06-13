import update from 'immutability-helper'
import MangaQL from '../graphql/query/manga'
import MangaML from '../graphql/mutation/manga'
import {
  loadItems,
  loadItemsById,
  mutateItem
} from './list-items'
import {createChapter} from './chapter'
import {Strings} from '../constants/values'
import updatePrePost from '../utils/validators/manga-post'
import {mapChapterData} from '../utils/data'


export const createManga = (item) => mutateItem(
  Strings.manga,
  item,
  MangaML.createManga
)

export const editManga = (item) => mutateItem(
  Strings.manga,
  item,
  MangaML.updateMangaById
)

export const addChapters = updateValues => {
  return function(dispatch, getState) {
    const manga = getState().entities.manga.byId[updateValues._id];
    const history = mapChapterData(manga, updateValues);
    console.log('add chapter => ', manga, updateValues, history)
    history.forEach(item => dispatch(createChapter(item)) );
    return updatePrePost(
      update(manga, {
        chapter: { $set: updateValues.chapter },
        volume: { $set: updateValues.volume || manga.volume }
      })
    )
    .then(editItem => {
      console.log('edit manga => ', editItem);
      dispatch(editManga(editItem));
    });
  }
}

export const loadManga = (filters = {}, pageChange = null) => loadItems({
    pageChange,
    filters,
    type: Strings.manga
  },
  MangaQL.getFilteredList
)

export const loadMangaById = (id, type = 'getById') => loadItemsById(
    Strings.manga,
    MangaQL[type](id)
)
