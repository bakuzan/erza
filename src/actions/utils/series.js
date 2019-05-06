import { toaster } from 'mko';

import erzaGQL from 'erzaGQL';
import { resetPageToZero, loadPageInfo } from 'actions/paging';
import { showAlertError } from 'actions/alert';
import { getSingleObjectProperty } from 'utils';

import {
  startingGraphqlRequest,
  finishGraphqlRequest,
  resolvePaging,
  loadItemToState,
  loadItemsToState,
  removeItemFromState
} from './helpers';
import redirectPostAction from './redirectPostAction';

// Query

export const loadItems = (query, filters, { type, pageChange }) => {
  return async function(dispatch, getState) {
    dispatch(startingGraphqlRequest());

    const { isAdult, paging, sorting } = getState();
    const updatedPaging = resolvePaging(paging[type], pageChange);

    const response = await erzaGQL({
      query,
      variables: {
        isAdult,
        sorting,
        paging: { size: updatedPaging.size, page: updatedPaging.page },
        ...filters
      }
    });

    const data = getSingleObjectProperty(response);
    if (!data) {
      return;
    }

    const { nodes, total, hasMore } = data;

    dispatch(loadItemsToState[type](nodes, updatedPaging, pageChange));
    dispatch(loadPageInfo({ total, hasMore }, type));

    if (!pageChange) {
      dispatch(resetPageToZero(type));
    }

    dispatch(finishGraphqlRequest());
  };
};

export const loadItemsById = (query, variables, type) => {
  return async function(dispatch, getState) {
    dispatch(startingGraphqlRequest());

    const response = await erzaGQL({
      query,
      variables
    });

    const data = getSingleObjectProperty(response);
    dispatch(loadItemToState[type](data));
    dispatch(finishGraphqlRequest());
  };
};

// Mutate

export function mutateItem(query, payload, type) {
  return async function(dispatch, getState) {
    dispatch(startingGraphqlRequest());

    const { lastLocation } = getState();

    const response = await erzaGQL({
      query,
      variables: { payload }
    });

    dispatch(finishGraphqlRequest());

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

      return;
    }

    // Clear out stored data because it's now stale!
    dispatch(resetPageToZero(type));

    toaster.success(
      'Saved!',
      `Successfully saved '${data.data.title}' ${type}.`
    );

    return redirectPostAction(type, lastLocation);
  };
}

export function removeItem(query, variables, type) {
  return async function(dispatch, getState) {
    dispatch(startingGraphqlRequest());

    const { lastLocation } = getState();

    const response = await erzaGQL({
      query,
      variables
    });

    const data = getSingleObjectProperty(response);

    dispatch(removeItemFromState[type](variables.id));
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

      return;
    }

    toaster.success('Deleted!', `Successfully deleted ${type}.`);
    return redirectPostAction(type, lastLocation);
  };
}
