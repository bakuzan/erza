import {
  addRequestIndicator,
  removeRequestIndicator
} from '../actions/request-indicator';
import { isObject } from '../utils/common';
import { showAlertError } from '../actions/alert';

import { store } from '../index';

const DEAD_RESPONSE = { data: null };

function validateResponse(data) {
  return isObject(data) && !!data.errors;
}

function setOptions(method, body) {
  return {
    method,
    body: !!body ? JSON.stringify(body) : null,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  };
}

const fetchFromServer = (url, method = 'GET', body = null) => {
  const options = setOptions(method, body);
  store.dispatch(addRequestIndicator(url));

  return fetch(url, options)
    .then((r) => r.json())
    .then((result) => {
      const isBadResponse = validateResponse(result);

      if (isBadResponse) {
        throw new Error(
          (result.errors[0] && result.errors[0].message) || 'Graphql Error'
        );
      }

      store.dispatch(removeRequestIndicator(url));
      return result;
    })
    .catch((error) => {
      store.dispatch(
        showAlertError({
          message: 'Graphql Error',
          detail: error.message
        })
      );
      store.dispatch(removeRequestIndicator(url));

      return DEAD_RESPONSE;
    });
};

export default fetchFromServer;
