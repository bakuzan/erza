import toaster from 'meiko/utils/toasterService';
import erzaGQL from 'erzaGQL';

import {
  resetPageToZero,
  loadPageInfo,
  loadHistoryAverageRating
} from 'actions/paging';
import { showAlertError } from 'actions/alert';
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
  return async function (dispatch, getState) {
    dispatch(startingGraphqlRequest());

    const { paging, isAdult } = getState();
    const updatedPaging = resolvePaging(paging[type], pageChange);

    const { sortKey, sortOrder, ...otherFilters } = filters;
    const response = await erzaGQL({
      query,
      variables: {
        isAdult,
        sorting: [sortKey, sortOrder],
        paging: { size: updatedPaging.size, page: updatedPaging.page },
        ...otherFilters
      }
    });

    const data = getSingleObjectProperty(response);
    if (!data) {
      return;
    }

    const { nodes, total, hasMore } = data;

    dispatch(loadItemsToState[type](nodes, updatedPaging, pageChange));
    dispatch(loadPageInfo({ total, hasMore, averageRating: null }, type));

    if (!pageChange) {
      dispatch(resetPageToZero(type));
    }

    dispatch(finishGraphqlRequest());
  };
}

export function loadHistoryBySeries(query, filters, { type, pageChange }) {
  return async function (dispatch, getState) {
    dispatch(startingGraphqlRequest());

    const { paging } = getState();
    const updatedPaging = resolvePaging(paging[type], pageChange);

    const response = await erzaGQL({
      query,
      variables: {
        sorting: ['date', 'DESC'],
        paging: { size: updatedPaging.size, page: updatedPaging.page },
        ...filters
      }
    });

    const data = getSingleObjectProperty(response);
    if (!data) {
      return;
    }

    const { nodes, total, hasMore, averageRating } = data;

    dispatch(loadItemsToState[type](nodes, updatedPaging, pageChange));
    dispatch(loadPageInfo({ total, hasMore, averageRating }, type));

    if (!pageChange) {
      dispatch(resetPageToZero(type));
    }

    dispatch(finishGraphqlRequest());
  };
}

// Mutate

export function mutateHistoryItem(query, item, type, queryHistoryForSeries) {
  const updateInState = refreshItemInState[type];

  return async function (dispatch, getState) {
    dispatch(startingGraphqlRequest());

    const { id, rating, note } = item;
    const payload = { id, rating, note };

    const { entities } = getState();
    const historyInState = entities[type].byId[id];

    // optimistic update
    dispatch(updateInState(payload));

    const response = await erzaGQL({
      query,
      variables: { payload }
    });

    dispatch(finishGraphqlRequest());

    const data = getSingleObjectProperty(response);
    if (!data || !data.success) {
      // rollback optimistic update
      dispatch(updateInState(historyInState));

      if (!data.success) {
        dispatch(
          showAlertError({
            message: data && data.errorMessages[0]
          })
        );
      }

      return;
    }

    dispatch(updateInState(data.data));
    toaster.success('Saved!', `Successfully saved '${type || 'history'}'.`);

    if (data.data.rating !== historyInState.rating) {
      const seriesId = historyInState.series.id;

      dispatch(
        updateHistoryAverages(queryHistoryForSeries, {
          seriesId,
          type
        })
      );
    }
  };
}

export function removeHistoryItem(query, variables, type) {
  return async function (dispatch) {
    dispatch(startingGraphqlRequest());

    const response = await erzaGQL({
      query,
      variables
    });

    const data = getSingleObjectProperty(response);

    dispatch(removeItemFromState[type](variables.id));
    dispatch(finishGraphqlRequest());

    if (!data || !data.success) {
      dispatch(
        showAlertError({
          message: data && data.errorMessages[0]
        })
      );

      return;
    }

    toaster.success('Deleted!', `Successfully deleted ${type}.`);
  };
}

// History Averages
function updateHistoryAverages(query, { type, seriesId }) {
  return async function (dispatch, getState) {
    const { paging } = getState();
    const updatedPaging = resolvePaging(paging[type], null);

    const response = await erzaGQL({
      query,
      variables: {
        sorting: ['date', 'DESC'],
        paging: { size: updatedPaging.size, page: updatedPaging.page },
        seriesId
      }
    });

    const data = getSingleObjectProperty(response);

    if (data) {
      dispatch(loadHistoryAverageRating(type, data.averageRating));
    }
  };
}
