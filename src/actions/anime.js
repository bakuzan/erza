import update from 'immutability-helper'
import { ADD_ANIME, ANIME_REQUEST, ANIME_LOAD, ANIME_SUCCESS } from '../constants/actions'
import { browserHistory } from 'react-router'
import toaster from '../utils/toaster'
import {mapEpisodeData} from '../utils/data'
import {Paths} from '../constants/paths'
import fetchFromServer from '../graphql/fetch'
import AnimeQL from '../graphql/query/anime'
import AnimeML from '../graphql/mutation/anime'
import {constructPagingAndSorting, constructRecordForPost} from '../graphql/query/common'
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

const addAnime = (item) => ({
  type: ADD_ANIME,
  item
})

export const createAnime = (item) => {
  console.log('%c create anime => ', 'color: magenta', item);
  return function(dispatch) {
    dispatch(startingAnimeRequest());
    const updatedAnime = constructRecordForPost(item);
    const mutation = AnimeML.createAnime(updatedAnime);
    fetchFromServer(`${Paths.graphql.base}${mutation}`, 'POST')
      .then(response => {
        dispatch(addAnime(response));
        dispatch(finishAnimeRequest());
        toaster.success('Added!', 'Successfully created anime.');
        return redirectPostAction();
      });
  }
}

// const updateAnime = (item) => ({
//   type: UPDATE_ANIME,
//   item
// })

export const editAnime = (item) => {
  console.log('%c edit anime => ', 'color: orange', item);
  return function(dispatch) {
    dispatch(startingAnimeRequest());
    const updatedAnime = constructRecordForPost(item);
    const mutation = AnimeML.updateAnimeById(updatedAnime);
    fetchFromServer(`${Paths.graphql.base}${mutation}`, 'POST')
      .then(response => {
        dispatch(finishAnimeRequest());
        toaster.success('Saved!', 'Successfully edited anime.');
        return redirectPostAction();
      });
  }
}

export const addEpisodes = (updateValues) => {
  return function(dispatch, getState) {
    const anime = getState().entities.anime.byId[updateValues.id];
    const history = mapEpisodeData(anime.episode, updateValues);
    console.log('add episode => ', anime, updateValues, history)
    setTimeout(() => {
      // save the history here!!
      const editItem = update(anime, {
        episode: { $set: updateValues.episode }
      });
      dispatch(editAnime(editItem));
    }, 1000)
  }
}

export const loadAnime = (filters = {}, pageChange = null) => {
  return function(dispatch, getState) {
    dispatch(startingAnimeRequest());
    const { isAdult, paging, sorting } = getState();
    const pageSettings = constructPagingAndSorting(paging, sorting, pageChange);
    const query = AnimeQL.getFilteredList(pageSettings, Object.assign({}, filters, { isAdult }) );
    console.log('%c query !! > ', 'font-weight: bold; font-size: 24px; color: red', query);
    fetchFromServer(`${Paths.graphql.base}${query}`)
      .then(response => {
        const data = response.data.animeConnection;
        dispatch(loadAnimeData(data.edges));
        dispatch(loadPageInfo({ pageInfo: data.pageInfo, count: data.count }));
        if (!pageChange) dispatch(resetPageToZero());
      })
      .then(() => dispatch(finishAnimeRequest()) );
  }
}

export const loadAnimeById = (id, type = 'getById') => {
  return function(dispatch) {
    dispatch(startingAnimeRequest());
    fetchFromServer(`${Paths.graphql.base}${AnimeQL[type](id)}`)
      .then(response => dispatch(loadAnimeData([{ node: response.data.animeById }])) )
      .then(() => dispatch(finishAnimeRequest()) );
  }
}
