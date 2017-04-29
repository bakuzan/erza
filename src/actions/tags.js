import { TAGS_LOAD, TAGS_REQUEST, TAGS_SUCCESS } from '../constants/actions'
import {Paths} from '../constants/paths'
import fetchFromServer from '../graphql/fetch'
import TagQL from '../graphql/query/tag'

const startingTagsRequest = () => ({
  type: TAGS_REQUEST,
  isFetching: true
})

const loadTagsData = (data) => ({
  type: TAGS_LOAD,
  data
})

const finishTagsRequest = () => ({
  type: TAGS_SUCCESS,
  isFetching: false
})

// const addTag = (item) => ({
//   type: ADD_TAG,
//   item
// })
//
// export const createTag = (item) => {
//   return function(dispatch) {
//     dispatch(startingTagsRequest());
//     var goToNext = Promise.resolve(item);
//     setTimeout(() => {
//       goToNext.then(response => {
//         dispatch(addTag(response));
//         dispatch(finishTagsRequest());
//       })
//     }, 1000);
//   }
// }

export const loadTags = () => {
  return function(dispatch) {
    dispatch(startingTagsRequest());
    fetchFromServer(`${Paths.graphql.base}${TagQL.getAll}`)
      .then(response => dispatch(loadTagsData(response.data.tagMany)) )
      .then(() => dispatch(finishTagsRequest()) );
  }
}
