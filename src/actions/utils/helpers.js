import { Strings } from 'constants/values';
import {
  GRAPHQL_REQUEST,
  GRAPHQL_SUCCESS,
  ANIME_LOAD,
  ANIME_ADD,
  ANIME_REMOVE,
  MANGA_LOAD,
  MANGA_ADD,
  MANGA_REMOVE,
  EPISODE_LOAD,
  CHAPTER_LOAD,
  EPISODE_REFRESH,
  CHAPTER_REFRESH,
  EPISODE_REMOVE,
  CHAPTER_REMOVE
} from 'constants/actions';

export const hydrateState = (type) => (data, paging, pageChange) => ({
  type,
  data,
  paging,
  pageChange
});

export const loadItemsToState = {
  [Strings.anime]: hydrateState(ANIME_LOAD),
  [Strings.manga]: hydrateState(MANGA_LOAD),
  [Strings.episode]: hydrateState(EPISODE_LOAD),
  [Strings.chapter]: hydrateState(CHAPTER_LOAD)
};

const refreshState = (type) => (item) => ({ type, item });
export const loadItemToState = {
  [Strings.anime]: refreshState(ANIME_ADD),
  [Strings.manga]: refreshState(MANGA_ADD)
};

export const refreshItemInState = {
  [Strings.episode]: refreshState(EPISODE_REFRESH),
  [Strings.chapter]: refreshState(CHAPTER_REFRESH)
};

const dehydrateState = (type) => (id) => ({ type, id });
export const removeItemFromState = {
  [Strings.anime]: dehydrateState(ANIME_REMOVE),
  [Strings.manga]: dehydrateState(MANGA_REMOVE),
  [Strings.episode]: dehydrateState(EPISODE_REMOVE),
  [Strings.chapter]: dehydrateState(CHAPTER_REMOVE)
};

export const startingGraphqlRequest = () => ({
  type: GRAPHQL_REQUEST,
  isFetching: true
});

export const finishGraphqlRequest = () => ({
  type: GRAPHQL_SUCCESS,
  isFetching: false
});

export const resolvePaging = (paging, pageChange) => ({
  ...paging,
  page: pageChange ? paging.page : 0
});

export function isBadResponse(data, attr) {
  const noData = !data || (attr && !data[attr]);
  const failure = data.hasOwnProperty('success') && !data.success;

  return noData || failure;
}
