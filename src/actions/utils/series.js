import { toaster } from 'mko';
import erzaGQL from 'erzaGQL';
import fetchFromServer from 'graphql/fetch';
import { constructRecordForPost } from 'graphql/common';
import { resetPageToZero, loadPageInfo } from 'actions/paging';
import { getSingleObjectProperty } from 'utils';
import { Paths } from 'constants/paths';

import {
  startingGraphqlRequest,
  finishGraphqlRequest,
  resolvePaging,
  loadItemToState,
  loadItemsToState
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

export const mutateItem = (type, item, queryBuilder) => {
  return function(dispatch, getState) {
    const { lastLocation } = getState();
    dispatch(startingGraphqlRequest());
    const itemForCreation = constructRecordForPost(item);
    const mutation = queryBuilder(itemForCreation);
    fetchFromServer(`${Paths.graphql.base}${mutation}`, 'POST').then(
      (response = {}) => {
        dispatch(finishGraphqlRequest());
        const data = getSingleObjectProperty(response.data);
        if (!data) return null;
        toaster.success(
          'Saved!',
          `Successfully saved '${data.record.title}' ${type}.`
        );
        return redirectPostAction(type, lastLocation);
      }
    );
  };
};
