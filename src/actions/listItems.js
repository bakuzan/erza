import { toaster } from 'mko';
import { history as Navigate } from '../index';

import fetchFromServer from '../graphql/fetch';
import {
  constructPagingAndSorting,
  constructRecordForPost
} from '../graphql/common';
import { resetPageToZero, loadPageInfo } from './paging';
import { getSingleObjectProperty } from '../utils';

import {
  GRAPHQL_REQUEST,
  GRAPHQL_SUCCESS,
  ANIME_LOAD,
  ADD_ANIME,
  MANGA_LOAD,
  ADD_MANGA,
  EPISODE_LOAD,
  CHAPTER_LOAD,
  EPISODE_REFRESH,
  CHAPTER_REFRESH,
  EPISODE_REMOVE,
  CHAPTER_REMOVE
} from '../constants/actions';
import { Paths } from '../constants/paths';
import { Strings } from '../constants/values';

const hydrateState = (type) => (data, paging, pageChange) => ({
  type,
  data,
  paging,
  pageChange
});
const refreshState = (type) => (item) => ({ type, item });
const dehydrateState = (type) => (id) => ({ type, id });
const loadItemsToState = {
  [Strings.anime]: hydrateState(ANIME_LOAD),
  [Strings.manga]: hydrateState(MANGA_LOAD),
  [Strings.episode]: hydrateState(EPISODE_LOAD),
  [Strings.chapter]: hydrateState(CHAPTER_LOAD)
};
const loadItemToState = {
  [Strings.anime]: refreshState(ADD_ANIME),
  [Strings.manga]: refreshState(ADD_MANGA)
};

const refreshItemInState = {
  [Strings.episode]: refreshState(EPISODE_REFRESH),
  [Strings.chapter]: refreshState(CHAPTER_REFRESH)
};

const removeItemFromState = {
  [Strings.episode]: dehydrateState(EPISODE_REMOVE),
  [Strings.chapter]: dehydrateState(CHAPTER_REMOVE)
};

const redirectPostAction = (type, lastLocation) => {
  const baseUrl = `${Paths.base}${Paths[type].list}`;
  if (window.location.href.includes(`${type}-list`))
    return Navigate.push(
      `${baseUrl}${window.location.href.replace(/^.*\//g, '')}`
    );

  const targetUrl =
    lastLocation && lastLocation.location
      ? lastLocation.location.pathname
      : `${baseUrl}${Strings.filters.ongoing}`;
  return Navigate.push(targetUrl);
};

const startingGraphqlRequest = () => ({
  type: GRAPHQL_REQUEST,
  isFetching: true
});

const finishGraphqlRequest = () => ({
  type: GRAPHQL_SUCCESS,
  isFetching: false
});

const resolvePaging = (paging, pageChange) => ({
  ...paging,
  page: pageChange ? paging.page : 0
});

export const mutateItem = (type, item, queryBuilder) => {
  return function(dispatch, getState) {
    const { lastLocation } = getState();
    dispatch(startingGraphqlRequest());
    const itemForCreation = constructRecordForPost(item);
    const mutation = queryBuilder(itemForCreation);
    fetchFromServer(`${Paths.graphql.base}${mutation}`, 'POST').then(
      (response = {}) => {
        dispatch(finishGraphqlRequest());
        const data = getSingleObjectProperty(response.data);
        if (!data) return null;
        toaster.success(
          'Saved!',
          `Successfully saved '${data.record.title}' ${type}.`
        );
        return redirectPostAction(type, lastLocation);
      }
    );
  };
};

export const loadItems = ({ type, filters, pageChange }, queryBuilder) => {
  return function(dispatch, getState) {
    dispatch(startingGraphqlRequest());
    const { isAdult, paging, sorting } = getState();
    const updatedPaging = resolvePaging(paging[type], pageChange);
    const pageSettings = constructPagingAndSorting(updatedPaging, sorting);
    const query = queryBuilder(
      pageSettings,
      Object.assign({}, filters, { isAdult })
    );
    fetchFromServer(`${Paths.graphql.base}${query}`)
      .then((response) => {
        const data = getSingleObjectProperty(response.data);
        if (!data) return null;
        dispatch(loadItemsToState[type](data.edges, updatedPaging, pageChange));
        dispatch(loadPageInfo({ count: data.count }, type));
        if (!pageChange) dispatch(resetPageToZero(type));
      })
      .then(() => dispatch(finishGraphqlRequest()));
  };
};

export const loadItemsById = (type, queryString) => {
  return function(dispatch, getState) {
    dispatch(startingGraphqlRequest());
    fetchFromServer(`${Paths.graphql.base}${queryString}`)
      .then((response) =>
        dispatch(loadItemToState[type](getSingleObjectProperty(response.data)))
      )
      .then(() => dispatch(finishGraphqlRequest()));
  };
};

// HISTORY ACTION CREATORS

export const mutateHistoryItem = (item, queryBuilder, type = null) => {
  return function(dispatch) {
    dispatch(startingGraphqlRequest());
    const itemForCreation = constructRecordForPost(item);
    const mutation = queryBuilder(itemForCreation);
    fetchFromServer(`${Paths.graphql.base}${mutation}`, 'POST').then(
      (response) => {
        dispatch(finishGraphqlRequest());
        const data = getSingleObjectProperty(response.data);
        if (!data) return null;
        if (type) dispatch(refreshItemInState[type](data.record));
        toaster.success(
          'Saved!',
          `Successfully saved '${data.record[type] || 'history'}'.`
        );
      }
    );
  };
};

export const removeHistoryItem = (type, id, queryBuilder) => {
  return function(dispatch) {
    dispatch(startingGraphqlRequest());
    const mutation = queryBuilder(id);
    fetchFromServer(`${Paths.graphql.base}${mutation}`, 'POST').then(
      (response) => {
        dispatch(removeItemFromState[type](id));
        dispatch(finishGraphqlRequest());
        const data = getSingleObjectProperty(response.data);
        if (!data) return null;
        toaster.success(
          'Deleted!',
          `Successfully deleted '${data.record.series.title}' history entry.`
        );
      }
    );
  };
};

export const loadHistoryByDateRange = (
  { type, filters, pageChange },
  queryBuilder
) => {
  return function(dispatch, getState) {
    dispatch(startingGraphqlRequest());
    const { paging, isAdult } = getState();
    const updatedPaging = resolvePaging(paging[type], pageChange);
    const pageSettings = constructPagingAndSorting(updatedPaging, {
      sortKey: 'date',
      sortOrder: 'DESC'
    });
    const query = queryBuilder(
      pageSettings,
      Object.assign({}, filters, { isAdult })
    );
    fetchFromServer(`${Paths.graphql.base}${query}`)
      .then((response) => {
        const data = getSingleObjectProperty(response.data);
        if (!data) return null;
        dispatch(loadItemsToState[type](data.edges, updatedPaging, pageChange));
        dispatch(loadPageInfo({ count: data.count }, type));
        if (!pageChange) dispatch(resetPageToZero(type));
      })
      .then(() => dispatch(finishGraphqlRequest()));
  };
};
