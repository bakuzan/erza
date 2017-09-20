import { ADD_TAG, TAGS_LOAD, TAGS_REQUEST, TAGS_SUCCESS } from '../constants/actions'
import {Paths} from '../constants/paths'
import fetchFromServer from '../graphql/fetch'
import {constructRecordForPost} from '../graphql/common'
import toaster from '../utils/toaster'
import {getSingleObjectProperty} from '../utils/common'
import TagQL from '../graphql/query/tag'
import TagML from '../graphql/mutation/tag'


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
  type: ADD_TAG,
  item
})

export const createTag = (item) => {
  return function(dispatch, getState) {
    dispatch(startingTagsRequest());
    const { isAdult } = getState();
    const itemForCreation = constructRecordForPost({ ...item, isAdult });
    const mutation = TagML.createTag(itemForCreation);
    fetchFromServer(`${Paths.graphql.base}${mutation}`, 'POST')
      .then(response => {
        dispatch(finishTagsRequest());
        const data = response.data[getSingleObjectProperty(response.data)];
        dispatch(addTag(data.record));
        toaster.success('Saved!', `Successfully saved '${data.record.name}' tag.`);
      });
  }
}

export const loadTags = () => {
  return function(dispatch) {
    dispatch(startingTagsRequest());
    fetchFromServer(`${Paths.graphql.base}${TagQL.getAll}`)
      .then(response => dispatch(loadTagsData(response.data.tagMany)) )
      .then(() => dispatch(finishTagsRequest()) );
  }
}
