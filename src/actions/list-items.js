import { browserHistory } from 'react-router'

import fetchFromServer from '../graphql/fetch'
import {constructPagingAndSorting, constructRecordForPost} from '../graphql/common'
import {resetPageToZero, loadPageInfo} from './paging'
import toaster from '../utils/toaster'
import {getSingleObjectProperty} from '../utils/common'
import {
  GRAPHQL_REQUEST, GRAPHQL_SUCCESS,
  ANIME_LOAD, MANGA_LOAD, EPISODE_LOAD, CHAPTER_LOAD,
  EPISODE_REFRESH, CHAPTER_REFRESH,
  EPISODE_REMOVE, CHAPTER_REMOVE
} from '../constants/actions'
import {Paths} from '../constants/paths'
import { Strings } from '../constants/values'


const hydrateState = type => data => ({ type, data })
const refreshState = type => item => ({ type, item })
const dehydrateState = type => id => ({ type, id })
const loadItemsToState = {
  [Strings.anime]: hydrateState(ANIME_LOAD),
  [Strings.manga]: hydrateState(MANGA_LOAD),
  [Strings.episode]: hydrateState(EPISODE_LOAD),
  [Strings.chapter]: hydrateState(CHAPTER_LOAD)
}

const refreshItemInState = {
  [Strings.episode]: refreshState(EPISODE_REFRESH),
  [Strings.chapter]: refreshState(CHAPTER_REFRESH)
}

const removeItemFromState = {
  [Strings.episode]: dehydrateState(EPISODE_REMOVE),
  [Strings.chapter]: dehydrateState(CHAPTER_REMOVE)
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

export const mutateHistoryItem = (item, queryBuilder, type = null) => {
  return function(dispatch) {
    dispatch(startingGraphqlRequest());
    const itemForCreation = constructRecordForPost(item);
    const mutation = queryBuilder(itemForCreation);
    fetchFromServer(`${Paths.graphql.base}${mutation}`, 'POST')
      .then(response => {
        console.log(`%c History  created`, 'font-size: 20px; color: indigo')
        const data = response.data[getSingleObjectProperty(response.data)];
        if (type) dispatch(refreshItemInState[type](data.record));
        dispatch(finishGraphqlRequest());
        toaster.success('Saved!', `Successfully saved '${data.record.series.title}'.`);
      });
  }
}

export const removeHistoryItem = (type, id, queryBuilder) => {
  return function(dispatch) {
    dispatch(startingGraphqlRequest());
    const mutation = queryBuilder(id);
    fetchFromServer(`${Paths.graphql.base}${mutation}`, 'POST')
      .then(response => {
        console.log(`%c History  created`, 'font-size: 20px; color: indigo')
        dispatch(removeItemFromState[type](id));
        dispatch(finishGraphqlRequest());
        const data = response.data[getSingleObjectProperty(response.data)];
        toaster.success('Deleted!', `Successfully deleted '${data.record.series.title}' history entry.`);
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
        dispatch(loadItemsToState[type](data.edges));
        dispatch(loadPageInfo({ count: data.count }));
      })
      .then(() => dispatch(finishGraphqlRequest()) );
  }
}

export const loadHistoryForSeries = (type, queryString) => {
  return function(dispatch) {
    dispatch(startingGraphqlRequest());
    fetchFromServer(`${Paths.graphql.base}${queryString}`)
      .then(response => dispatch(loadItemsToState[type](response.data[getSingleObjectProperty(response.data)])) )
      .then(() => dispatch(finishGraphqlRequest()) );
  }
}
