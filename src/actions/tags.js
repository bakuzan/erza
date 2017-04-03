import { TAGS_LOAD, TAGS_REQUEST, TAGS_SUCCESS } from '../constants/actions'

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
    { id: 4, name: 'blow', isAdult: true }
  ]);
}

export const loadTags = () => {
  return function(dispatch) {
    dispatch(startingTagsRequest());
    fetchTags()
      .then(data => dispatch(loadTagsData(data)) )
      .then(() => dispatch(finishTagsRequest()) );
  }
}
