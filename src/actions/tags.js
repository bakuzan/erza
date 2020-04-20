import toaster from 'meiko/utils/toasterService';

import erzaGQL from 'erzaGQL';
import { getTagById, getTags, getTagsMinimal } from 'erzaGQL/query';
import { tagUpdate, tagRemove } from 'erzaGQL/mutation';

import { showAlertError } from 'actions/alert';
import { startingGraphqlRequest, finishGraphqlRequest } from './utils/helpers';
import { TAG_ADD, TAG_REMOVE, TAGS_LOAD } from 'constants/actions';
import { getSingleObjectProperty } from 'utils';

const loadTagsData = (data) => ({
  type: TAGS_LOAD,
  data
});

const addTag = (item) => ({
  type: TAG_ADD,
  item
});

const removeTag = (id) => ({
  type: TAG_REMOVE,
  id
});

// Query

export function loadTags() {
  return async function (dispatch, getState) {
    dispatch(startingGraphqlRequest());

    const { isAdult } = getState();
    const response = await erzaGQL({ query: getTags, variables: { isAdult } });

    dispatch(loadTagsData(response.tags));
    dispatch(finishGraphqlRequest());
  };
}

export function loadTagList() {
  return async function (dispatch, getState) {
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
  return async function (dispatch) {
    dispatch(startingGraphqlRequest());

    const response = await erzaGQL({
      query: getTagById,
      variables: { id }
    });

    dispatch(addTag(response.tagById));
    dispatch(finishGraphqlRequest());
  };
}

// Mutate

export function updateTag(payload) {
  return async function (dispatch) {
    dispatch(startingGraphqlRequest());

    const response = await erzaGQL({
      query: tagUpdate,
      variables: { payload }
    });

    const data = getSingleObjectProperty(response);

    if (!data) {
      return;
    }

    if (!data.success) {
      dispatch(
        showAlertError({
          message: data && data.errorMessages[0]
        })
      );

      return null;
    }

    dispatch(addTag(data.data));
    toaster.success('Saved!', `Successfully saved '${data.data.name}' tag.`);

    dispatch(finishGraphqlRequest());
  };
}

export function deleteTag(id) {
  return async function (dispatch) {
    dispatch(startingGraphqlRequest());

    const response = await erzaGQL({ query: tagRemove, variables: { id } });
    const data = response.tagRemove;

    dispatch(removeTag(id));
    dispatch(finishGraphqlRequest());

    if (!data) {
      return;
    }

    if (!data.success) {
      dispatch(
        showAlertError({
          message: data && data.errorMessages[0]
        })
      );

      return null;
    }

    toaster.success('Deleted!', `Successfully deleted tag.`);
  };
}
