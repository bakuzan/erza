import { Utils } from 'meiko';
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

const fetchFromServer = (url, method = 'GET', body = null) => {
  store.dispatch(addRequestIndicator(url));
  return Utils.MeikoFetch(url, method, body)
    .then(jsonResult => {
      const badResponse = validateResponse(jsonResult);

      if (badResponse) {
        throw new Error(
          (jsonResult.errors[0] &&
            jsonResult.errors[0].message) ||
          'Graphql Error'
        );
      }

      store.dispatch(removeRequestIndicator(url));
      return jsonResult;
    })
    .catch(error => {
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
