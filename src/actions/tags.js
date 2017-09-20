import { TAGS_LOAD, TAGS_REQUEST, TAGS_SUCCESS } from '../constants/actions'
import {Paths} from '../constants/paths'
import fetchFromServer from '../graphql/fetch'
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

export const createTag = (item) => {
  return function(dispatch, getState) {
    dispatch(startingTagsRequest());
    const { isAdult } = getState();
    const itemForCreation = constructRecordForPost({ ...item, isAdult });
    const mutation = TagML.createTag(itemForCreation);
    fetchFromServer(`${Paths.graphql.base}${mutation}`)
      .then(response => {
        dispatch(finishTagsRequest());
        const data = response.data[getSingleObjectProperty(response.data)];
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
