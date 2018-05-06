import { Utils } from 'meiko';
import {
  ADD_TAG,
  REMOVE_TAG,
  TAGS_LOAD,
  TAGS_REQUEST,
  TAGS_SUCCESS
} from '../constants/actions';
import { Paths } from '../constants/paths';
import fetchFromServer from '../graphql/fetch';
import { constructRecordForPost } from '../graphql/common';
import { getSingleObjectProperty } from '../utils/common';
import TagQL from '../graphql/query/tag';
import TagML from '../graphql/mutation/tag';

const startingTagsRequest = () => ({
  type: TAGS_REQUEST,
  isFetching: true
});

const loadTagsData = data => ({
  type: TAGS_LOAD,
  data
});

const finishTagsRequest = () => ({
  type: TAGS_SUCCESS,
  isFetching: false
});

const addTag = item => ({
  type: ADD_TAG,
  item
});

const removeTag = id => ({
  type: REMOVE_TAG,
  id
});

const mutateTag = (queryBuilder, item) => {
  return function(dispatch, getState) {
    dispatch(startingTagsRequest());
    const { isAdult } = getState();
    const itemForCreation = constructRecordForPost({ ...item, isAdult });
    const mutation = queryBuilder(itemForCreation);
    fetchFromServer(`${Paths.graphql.base}${mutation}`, 'POST')
      .then(response => {
        const data = getSingleObjectProperty(response.data);
        if (!data) return null;
        dispatch(addTag(data.record));
        Utils.Toaster.success(
          'Saved!',
          `Successfully saved '${data.record.name}' tag.`
        );
      })
      .then(() => dispatch(finishTagsRequest()));
  };
};

export const createTag = item => mutateTag(TagML.createTag, item);
export const updateTag = item => mutateTag(TagML.updateTag, item);

export const deleteTag = tagId => {
  return function(dispatch) {
    dispatch(startingTagsRequest());
    fetchFromServer(`${Paths.graphql.base}${TagML.deleteTag(tagId)}`, 'POST')
      .then(response => {
        const data = getSingleObjectProperty(response.data);
        dispatch(removeTag(tagId));
        if (!data) return null;
        Utils.Toaster.success(
          'Removed!',
          `Successfully deleted '${data.record.name}' tag.`
        );
      })
      .then(() => dispatch(finishTagsRequest()));
  };
};

export const loadTags = () => {
  return function(dispatch, getState) {
    dispatch(startingTagsRequest());
    const { isAdult } = getState();
    fetchFromServer(`${Paths.graphql.base}${TagQL.getAll(isAdult)}`)
      .then(response => dispatch(loadTagsData(response.data.tagMany)))
      .then(() => dispatch(finishTagsRequest()));
  };
};

export const loadTagList = () => {
  return function(dispatch, getState) {
    dispatch(startingTagsRequest());
    const { isAdult } = getState();
    fetchFromServer(`${Paths.graphql.base}${TagQL.getList(isAdult)}`)
      .then(response => dispatch(loadTagsData(response.data.tagMany)))
      .then(() => dispatch(finishTagsRequest()));
  };
};

export const loadTag = tagId => {
  return function(dispatch) {
    dispatch(startingTagsRequest());
    fetchFromServer(`${Paths.graphql.base}${TagQL.getById(tagId)}`)
      .then(response => dispatch(addTag(response.data.tagById)))
      .then(() => dispatch(finishTagsRequest()));
  };
};
