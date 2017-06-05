// import update from 'immutability-helper'
import { MANGA_LOAD } from '../constants/actions'
// import { browserHistory } from 'react-router'
// import toaster from '../utils/toaster'
// import updatePrePost from '../utils/validators/anime-post'
// import {mapEpisodeData} from '../utils/data'
// import {Paths} from '../constants/paths'
// import fetchFromServer from '../graphql/fetch'
import MangaQL from '../graphql/query/manga'
// import MangaML from '../graphql/mutation/manga'
// import {constructPagingAndSorting, constructRecordForPost} from '../graphql/common'
// import {createEpisode} from './episode'
// import {resetPageToZero, loadPageInfo} from './paging'
import {Strings} from '../constants/values'
import {loadItems, loadItemsById} from './list-items'


// const redirectPostAction = () => browserHistory.push(`${Paths.base}${Paths.anime.list}${Strings.filters.ongoing}`);

export const loadMangaData = (data) => ({
  type: MANGA_LOAD,
  data
})

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
