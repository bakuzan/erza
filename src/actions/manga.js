// import update from 'immutability-helper'
// import { ANIME_REQUEST, ANIME_LOAD, ANIME_SUCCESS } from '../constants/actions'
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
// import {Strings} from '../constants/values'
import {loadItems, loadItemsById} from './list-items'


// const redirectPostAction = () => browserHistory.push(`${Paths.base}${Paths.anime.list}${Strings.filters.ongoing}`);

export const loadManga = (filters = {}, pageChange = null) => {
  return function(dispatch, getState) {
    const { isAdult, paging, sorting } = getState();
    dispatch(
      loadItems(
        dispatch,
        {
          paging,
          sorting,
          pageChange,
          filters: Object.assign({}, filters, isAdult)
        },
        MangaQL.getFilteredList
      )
    )
  }
}

export const loadMangaById = (id, type = 'getById') => {
  return function(dispatch) {
    const queryString = MangaQL[type](id);
    dispatch(loadItemsById(dispatch, queryString));
  }
}
