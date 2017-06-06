// import update from 'immutability-helper'
import { GRAPHQL_REQUEST, GRAPHQL_SUCCESS } from '../constants/actions'
import { browserHistory } from 'react-router'
import toaster from '../utils/toaster'
// import updatePrePost from '../utils/validators/anime-post'
import {getSingleObjectProperty} from '../utils/common'
import {Paths} from '../constants/paths'
import fetchFromServer from '../graphql/fetch'
import {constructPagingAndSorting} from '../graphql/common'
// import {createEpisode} from './episode'
import {loadAnimeData} from './anime'
import {loadMangaData} from './manga'
import {resetPageToZero, loadPageInfo} from './paging'
import { Strings } from '../constants/values'

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

// export const addEpisodes = updateValues => {
//   return function(dispatch, getState) {
//     const anime = getState().entities.anime.byId[updateValues._id];
//     const history = mapEpisodeData(anime, updateValues);
//     console.log('add episode => ', anime, updateValues, history)
//     history.forEach(item => dispatch(createEpisode(item)) );
//     return updatePrePost(
//       update(anime, {
//         episode: { $set: updateValues.episode }
//       })
//     )
//     .then(editItem => {
//       console.log('edit anime => ', editItem);
//       dispatch(editAnime(editItem));
//     });
//   }
// }

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
