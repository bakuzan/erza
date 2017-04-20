import update from 'immutability-helper'
import { ADD_ANIME, UPDATE_ANIME, ANIME_REQUEST, ANIME_LOAD, ANIME_SUCCESS } from '../constants/actions'
import { browserHistory } from 'react-router'
import toaster from '../utils/toaster'
import {mapEpisodeData} from '../utils/data'
import {Paths} from '../constants/paths'
import fetchFromServer from '../graphql/fetch'
import AnimeQL from '../graphql/query/anime'
import {loadPageInfo} from './list-settings'
import {Strings} from '../constants/values'

const redirectPostAction = () => browserHistory.push(`${Paths.base}${Paths.anime.list}${Strings.filters.ongoing}`);

let testId = 7;
const getTestId = () => {
  return testId++;
}

// temp function
const tempFunctionForPageing = (paging, { sortKey, sortOrder }) => {
  return `
    first: ${paging.itemsPerPage},
    ${
      !paging.move           ? ' '                      :
      paging.move === 'NEXT' ? `after: ${paging.after},` :
                               `before: ${paging.before},`
    }
    orderBy: ${sortKey.toUpperCase()}_${sortOrder},
  `;
}
//

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
  console.log(item);
  return function(dispatch) {
    dispatch(startingAnimeRequest());
    item.id = getTestId();
    var goToNext = Promise.resolve(item);
    setTimeout(() => {
      goToNext.then(response => {
        dispatch(addAnime(response));
        dispatch(finishAnimeRequest());
        toaster.success('Added!', 'Successfully created anime.');
        return redirectPostAction();
      })
    }, 1000);
  }
}

const updateAnime = (item) => ({
  type: UPDATE_ANIME,
  item
})

export const editAnime = (item) => {
  console.log(item);
  return function(dispatch) {
    dispatch(startingAnimeRequest());
    dispatch(updateAnime(item));
    setTimeout(() => {
      dispatch(finishAnimeRequest());
      toaster.success('Saved!', 'Successfully edited anime.');
      return redirectPostAction();
    }, 1000)
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

export const loadAnime = (status = 1) => {
  return function(dispatch, getState) {
    dispatch(startingAnimeRequest());
    const { paging, sorting } = getState();
    const pageSettings = tempFunctionForPageing(paging, sorting);
    console.log('page settings => ', pageSettings);
    fetchFromServer(`${Paths.graphql.base}${AnimeQL.getByStatus(pageSettings, status)}`)
      .then(response => {
        const data = response.data.viewer.animes;
        dispatch(loadAnimeData(data.edges));
        dispatch(loadPageInfo({ pageInfo: data.pageInfo, count: data.count }));
      })
      .then(() => dispatch(finishAnimeRequest()) );
  }
}

export const loadAnimeById = (id, type = 'getById') => {
  return function(dispatch) {
    dispatch(startingAnimeRequest());
    fetchFromServer(`${Paths.graphql.base}${AnimeQL[type](id)}`)
      .then(response => dispatch(loadAnimeData([response.data.anime])) )
      .then(() => dispatch(finishAnimeRequest()) );
  }
}
