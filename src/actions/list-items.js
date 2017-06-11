// import update from 'immutability-helper'
import { GRAPHQL_REQUEST, GRAPHQL_SUCCESS } from '../constants/actions'
import { browserHistory } from 'react-router'
import toaster from '../utils/toaster'
// import updatePrePost from '../utils/validators/anime-post'
import {getSingleObjectProperty} from '../utils/common'
import {Paths} from '../constants/paths'
import fetchFromServer from '../graphql/fetch'
import {constructPagingAndSorting, constructRecordForPost} from '../graphql/common'
import { loadAnimeData } from './anime'
import { loadMangaData } from './manga'
import { loadEpisodeData } from './episode'
import { loadChapterData } from './chapter'
import {resetPageToZero, loadPageInfo} from './paging'
import { Strings } from '../constants/values'

console.log('LOAD FUNCTIONS => ', loadAnimeData, loadMangaData);

const loadItemsToState = {
  [Strings.anime]: loadAnimeData,
  [Strings.manga]: loadMangaData
}

const redirectPostAction = type => browserHistory.push(`${Paths.base}${Paths[type].list}${Strings.filters.ongoing}`);

const startingGraphqlRequest = () => ({
  type: GRAPHQL_REQUEST,
  isFetching: true
})

const finishGraphqlRequest = () => ({
  type: GRAPHQL_SUCCESS,
  isFetching: false
})

export const mutateItem = (type, item, queryBuilder) => {
  return function(dispatch) {
    dispatch(startingGraphqlRequest());
    const itemForCreation = constructRecordForPost(item);
    const mutation = queryBuilder(itemForCreation);
    fetchFromServer(`${Paths.graphql.base}${mutation}`, 'POST')
      .then(response => {
        dispatch(finishGraphqlRequest());
        const data = response.data[getSingleObjectProperty(response.data)];
        toaster.success('Saved!', `Successfully saved '${data.record.title}' ${type}.`);
        return redirectPostAction(type);
      });
  }
}

export const loadItems = ({ type, filters, pageChange }, queryBuilder) => {
  return function(dispatch, getState) {
    dispatch(startingGraphqlRequest());
    if (!pageChange) dispatch(resetPageToZero());
    const { isAdult, paging, sorting } = getState();
    const pageSettings = constructPagingAndSorting(paging, sorting);
    const query = queryBuilder(pageSettings, Object.assign({}, filters, { isAdult }));
    fetchFromServer(`${Paths.graphql.base}${query}`)
      .then(response => {
        const data = response.data[getSingleObjectProperty(response.data)];
        console.log('load items >> ', type, loadItemsToState);
        dispatch(loadItemsToState[type](data.edges));
        dispatch(loadPageInfo({ count: data.count }));
      })
      .then(() => dispatch(finishGraphqlRequest()) );
  }
}

export const loadItemsById = (type, queryString) => {
  return function(dispatch, getState) {
    dispatch(startingGraphqlRequest());
    fetchFromServer(`${Paths.graphql.base}${queryString}`)
      .then(response => dispatch(loadItemsToState[type]([{ node: response.data[getSingleObjectProperty(response.data)] }])) )
      .then(() => dispatch(finishGraphqlRequest()) );
  }
}


// HISTORY ACTION CREATORS
const loadHistoryToState = {
  [Strings.episode]: loadEpisodeData,
  [Strings.chapter]: loadChapterData
}

export const mutateHistoryItem = (item, queryBuilder) => {
  return function(dispatch) {
    dispatch(startingGraphqlRequest());
    const itemForCreation = constructRecordForPost(item);
    const mutation = queryBuilder(itemForCreation);
    fetchFromServer(`${Paths.graphql.base}${mutation}`, 'POST')
      .then(response => {
        console.log(`%c History  created`, 'font-size: 20px; color: indigo')
        dispatch(finishGraphqlRequest());
      });
  }
}

export const loadHistoryByDateRange = ({ type, filters, pageChange }, queryBuilder) => {
  return function(dispatch, getState) {
    dispatch(startingGraphqlRequest());
    if (!pageChange) dispatch(resetPageToZero());
    const { paging, isAdult } = getState();
    const pageSettings = constructPagingAndSorting(paging, { sortKey: 'date', sortOrder: 'DESC' });
    const query = queryBuilder(pageSettings, Object.assign({}, filters, { isAdult }) );
    fetchFromServer(`${Paths.graphql.base}${query}`)
      .then(response => {
        const data = response.data[getSingleObjectProperty(response.data)];
        console.log('load items >> ', type, loadItemsToState);
        dispatch(loadHistoryToState[type](data.edges));
        dispatch(loadPageInfo({ count: data.count }));
      })
      .then(() => dispatch(finishGraphqlRequest()) );
  }
}

export const loadHistoryForSeries = (type, queryString) => {
  return function(dispatch) {
    dispatch(startingGraphqlRequest());
    fetchFromServer(`${Paths.graphql.base}${queryString}`)
      .then(response => dispatch(loadHistoryToState[type](response.data[getSingleObjectProperty(response.data)])) )
      .then(() => dispatch(finishGraphqlRequest()) );
  }
}
