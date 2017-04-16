import { TAGS_LOAD, TAGS_REQUEST, TAGS_SUCCESS } from '../constants/actions'
import {Paths} from '../constants/paths'
import TagQL from '../graphql/query/tag'

const setOptions = (method = 'GET', body = null) => {
  return {
    method: method,
    body: body ? JSON.stringify(body) : body,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  };
}

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

//TEMP UNTIL SERVER-SIDE
const fetchTags = () => {
  return Promise.resolve([
    { id: 0, name: 'action', isAdult: false },
    { id: 1, name: 'comedy', isAdult: false },
    { id: 2, name: 'adventure', isAdult: false },
    { id: 3, name: 'vanilla', isAdult: true },
    { id: 4, name: 'blow', isAdult: true },
    { id: 7, name: 'martial arts', isAdult: false }
  ]);
}

export const loadTags = () => {
  return function(dispatch) {
    dispatch(startingTagsRequest());
    fetch(`${Paths.graphql.base}${TagQL.getAll}`, setOptions())
      .then(data => dispatch(loadTagsData(data)) )
      .then(() => dispatch(finishTagsRequest()) );
  }
}
