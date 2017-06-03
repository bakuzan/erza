import update from 'immutability-helper'
import { ANIME_REQUEST, ANIME_LOAD, ANIME_SUCCESS } from '../constants/actions'
import { browserHistory } from 'react-router'
import toaster from '../utils/toaster'
import updatePrePost from '../utils/validators/anime-post'
import {mapEpisodeData} from '../utils/data'
import {Paths} from '../constants/paths'
import fetchFromServer from '../graphql/fetch'
import AnimeQL from '../graphql/query/anime'
import AnimeML from '../graphql/mutation/anime'
import {constructPagingAndSorting, constructRecordForPost} from '../graphql/common'
import {createEpisode} from './episode'
import {resetPageToZero, loadPageInfo} from './paging'
import {Strings} from '../constants/values'

const redirectPostAction = () => browserHistory.push(`${Paths.base}${Paths.anime.list}${Strings.filters.ongoing}`);

const startingAnimeRequest = () => ({
  type: ANIME_REQUEST,
  isFetching: true
})

const loadAnimeData = (data) => ({
  type: ANIME_LOAD,
  data
})

const finishAnimeRequest = () => ({
  type: ANIME_SUCCESS,
  isFetching: false
})

export const createAnime = (item) => {
  return function(dispatch) {
    dispatch(startingAnimeRequest());
    const updatedAnime = constructRecordForPost(item);
    const mutation = AnimeML.createAnime(updatedAnime);
    fetchFromServer(`${Paths.graphql.base}${mutation}`, 'POST')
      .then(response => {
        dispatch(finishAnimeRequest());
        toaster.success('Added!', `Successfully created '${response.data.animeCreate.record.title}' anime.`);
        return redirectPostAction();
      });
  }
}

export const editAnime = (item) => {
  return function(dispatch) {
    dispatch(startingAnimeRequest());
    const updatedAnime = constructRecordForPost(item);
    const mutation = AnimeML.updateAnimeById(updatedAnime);
    fetchFromServer(`${Paths.graphql.base}${mutation}`, 'POST')
      .then(response => {
        dispatch(finishAnimeRequest());
        toaster.success('Saved!', `Successfully edited '${response.data.animeUpdateById.record.title}' anime.`);
        return redirectPostAction();
      });
  }
}

export const addEpisodes = updateValues => {
  return function(dispatch, getState) {
    const anime = getState().entities.anime.byId[updateValues._id];
    const history = mapEpisodeData(anime, updateValues);
    console.log('add episode => ', anime, updateValues, history)
    history.forEach(item => dispatch(createEpisode(item)) );
    return updatePrePost(
      update(anime, {
        episode: { $set: updateValues.episode }
      })
    )
    .then(editItem => {
      console.log('edit anime => ', editItem);
      dispatch(editAnime(editItem));
    });
  }
}

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
