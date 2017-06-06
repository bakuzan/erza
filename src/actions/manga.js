import { MANGA_LOAD } from '../constants/actions'
import MangaQL from '../graphql/query/manga'
import MangaML from '../graphql/mutation/manga'
import {
  loadItems, 
  loadItemsById,
  mutateItem
} from './list-items'
import {Strings} from '../constants/values'

export const loadMangaData = (data) => ({
  type: MANGA_LOAD,
  data
})

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
