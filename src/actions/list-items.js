// import update from 'immutability-helper'
import { GRAPHQL_REQUEST, GRAPHQL_LOAD, GRAPHQL_SUCCESS } from '../constants/actions'
// import { browserHistory } from 'react-router'
// import toaster from '../utils/toaster'
// import updatePrePost from '../utils/validators/anime-post'
import {getSingleObjectProperty} from '../utils/common'
import {Paths} from '../constants/paths'
import fetchFromServer from '../graphql/fetch'
// import AnimeML from '../graphql/mutation/anime'
import {constructPagingAndSorting} from '../graphql/common'
// import {createEpisode} from './episode'
import {resetPageToZero, loadPageInfo} from './paging'
// import {Strings} from '../constants/values'

// const redirectPostAction = () => browserHistory.push(`${Paths.base}${Paths.anime.list}${Strings.filters.ongoing}`);

const startingGraphqlRequest = () => ({
  type: GRAPHQL_REQUEST,
  isFetching: true
})

const loadItemsToState = (data) => ({
  type: GRAPHQL_LOAD,
  data
})

const finishGraphqlRequest = () => ({
  type: GRAPHQL_SUCCESS,
  isFetching: false
})

// export const createAnime = (item) => {
//   return function(dispatch) {
//     dispatch(startingGraphqlRequest());
//     const updatedAnime = constructRecordForPost(item);
//     const mutation = AnimeML.createAnime(updatedAnime);
//     fetchFromServer(`${Paths.graphql.base}${mutation}`, 'POST')
//       .then(response => {
//         dispatch(finishAnimeRequest());
//         toaster.success('Added!', `Successfully created '${response.data.animeCreate.record.title}' anime.`);
//         return redirectPostAction();
//       });
//   }
// }
//
// export const editAnime = (item) => {
//   return function(dispatch) {
//     dispatch(startingGraphqlRequest());
//     const updatedAnime = constructRecordForPost(item);
//     const mutation = AnimeML.updateAnimeById(updatedAnime);
//     fetchFromServer(`${Paths.graphql.base}${mutation}`, 'POST')
//       .then(response => {
//         dispatch(finishAnimeRequest());
//         toaster.success('Saved!', `Successfully edited '${response.data.animeUpdateById.record.title}' anime.`);
//         return redirectPostAction();
//       });
//   }
// }
//
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

export const loadItems = ({ filters, pageChange }, queryBuilder) => {
  return function(dispatch, getState) {
    dispatch(startingGraphqlRequest());
    if (!pageChange) dispatch(resetPageToZero());
    const { isAdult, paging, sorting } = getState();
    const pageSettings = constructPagingAndSorting(paging, sorting);
    const query = queryBuilder(pageSettings, Object.assign({}, filters, { isAdult }));
    fetchFromServer(`${Paths.graphql.base}${query}`)
      .then(response => {
        const data = response.data[getSingleObjectProperty(response.data)];
        dispatch(loadItemsToState(data.edges));
        dispatch(loadPageInfo({ count: data.count }));
      })
      .then(() => dispatch(finishGraphqlRequest()) );
  }
}

export const loadItemsById = (dispatch, queryString) => {
  dispatch(startingGraphqlRequest());
  fetchFromServer(`${Paths.graphql.base}${queryString}`)
    .then(response => dispatch(loadItemsToState([{ node: response.data[getSingleObjectProperty(response.data)] }])) )
    .then(() => dispatch(finishGraphqlRequest()) );
}
