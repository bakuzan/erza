import { ADD_TAG, TAG_LOAD, TAGS_REQUEST, TAGS_SUCCESS } from '../constants/actions'

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

const addTag = (item) => ({
  type: ADD_TAGS,
  item
})

//TEMP UNTIL SERVER-SIDE
const fetchTags = () => {
  return Promise.resolve([
    { id: 0, name: 'action', isAdult: false }
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
