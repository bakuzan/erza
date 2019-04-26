import { toaster } from 'mko';
import erzaGQL from 'erzaGQL';

import { resetPageToZero, loadPageInfo } from 'actions/paging';
import { getSingleObjectProperty } from 'utils';

import {
  startingGraphqlRequest,
  finishGraphqlRequest,
  resolvePaging,
  loadItemsToState,
  refreshItemInState,
  removeItemFromState
} from './helpers';

// Query

export function loadHistoryByDateRange(query, filters, { type, pageChange }) {
  return async function(dispatch, getState) {
    dispatch(startingGraphqlRequest());

    const { paging, isAdult } = getState();
    const updatedPaging = resolvePaging(paging[type], pageChange);

    const response = await erzaGQL({
      query,
      variables: {
        isAdult,
        sorting: ['date', 'DESC'],
        paging: { size: updatedPaging.size, page: updatedPaging.page },
        ...filters
      }
    });

    const data = getSingleObjectProperty(response);
    if (!data) {
      return null;
    }

    const { nodes, total, hasMore } = data;

    dispatch(loadItemsToState[type](nodes, updatedPaging, pageChange));
    dispatch(loadPageInfo({ total, hasMore }, type));

    if (!pageChange) {
      dispatch(resetPageToZero(type));
    }

    dispatch(finishGraphqlRequest());
  };
}

// Mutate

export function mutateHistoryItem(query, item, type) {
  return async function(dispatch) {
    dispatch(startingGraphqlRequest());

    const response = await erzaGQL({
      query,
      variables: { ...item }
    });

    dispatch(finishGraphqlRequest());

    const data = getSingleObjectProperty(response);

    if (!data || !data.success) {
      // TODO display alert with data.errorMessages
      return null;
    }

    if (type) {
      dispatch(refreshItemInState[type](data.data));
    }

    toaster.success('Saved!', `Successfully saved '${type || 'history'}'.`);
  };
}

export function removeHistoryItem(query, variables, type) {
  return async function(dispatch) {
    dispatch(startingGraphqlRequest());

    const response = await erzaGQL({
      query,
      variables
    });

    const data = getSingleObjectProperty(response);

    dispatch(removeItemFromState[type](variables.id));
    dispatch(finishGraphqlRequest());

    if (!data || !data.success) {
      // TODO display alert with data.errorMessages
      return null;
    }

    toaster.success('Deleted!', `Successfully deleted ${type}.`);
  };
}
