import { toaster } from 'mko';

import erzaGQL from 'erzaGQL';
import { getTagById, getTags, getTagsMinimal } from 'erzaGQL/query';
import { tagUpdate, tagRemove } from 'erzaGQL/mutation';

import { startingGraphqlRequest, finishGraphqlRequest } from './utils/helpers';
import { ADD_TAG, REMOVE_TAG, TAGS_LOAD } from 'constants/actions';
import { getSingleObjectProperty } from 'utils';

const loadTagsData = (data) => ({
  type: TAGS_LOAD,
  data
});

const addTag = (item) => ({
  type: ADD_TAG,
  item
});

const removeTag = (id) => ({
  type: REMOVE_TAG,
  id
});

// Query

export function loadTags() {
  return async function(dispatch, getState) {
    dispatch(startingGraphqlRequest());

    const { isAdult } = getState();
    const response = await erzaGQL({ query: getTags, variables: { isAdult } });

    dispatch(loadTagsData(response.tags));
    dispatch(finishGraphqlRequest());
  };
}

export function loadTagList() {
  return async function(dispatch, getState) {
    dispatch(startingGraphqlRequest());

    const { isAdult } = getState();
    const response = await erzaGQL({
      query: getTagsMinimal,
      variables: { isAdult }
    });

    dispatch(loadTagsData(response.tags));
    dispatch(finishGraphqlRequest());
  };
}

export function loadTag(id) {
  return async function(dispatch) {
    dispatch(startingGraphqlRequest());

    const response = await erzaGQL({
      query: getTagById,
      variables: { id }
    });

    dispatch(loadTagsData(response.tagById));
    dispatch(finishGraphqlRequest());
  };
}

// Mutate

export function updateTag(item) {
  return async function(dispatch) {
    dispatch(startingGraphqlRequest());

    const response = await erzaGQL({
      query: tagUpdate,
      variables: { ...item }
    });

    const data = getSingleObjectProperty(response);

    if (!data || !data.success) {
      return null;
    }

    dispatch(addTag(data.data));
    toaster.success('Saved!', `Successfully saved '${data.data.name}' tag.`);

    dispatch(finishGraphqlRequest());
  };
}

export function deleteTag(id) {
  return async function(dispatch) {
    dispatch(startingGraphqlRequest());

    const response = await erzaGQL({ query: tagRemove, variables: { id } });
    const data = response.tagRemove;

    dispatch(removeTag(id));
    dispatch(finishGraphqlRequest());

    if (!data || !data.success) {
      // TODO handle error alert
      return null;
    }

    toaster.success('Deleted!', `Successfully deleted tag.`);
  };
}
