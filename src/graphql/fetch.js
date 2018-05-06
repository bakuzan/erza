import { Utils } from 'meiko';
import toaster from '../utils/toaster';
import {
  addRequestIndicator,
  removeRequestIndicator
} from '../actions/request-indicator';
import { showAlertError } from '../actions/alert';
import { isObject } from '../utils/common';
import { store } from '../index';

const fetchFromServer = (url, method = 'GET', body = null) => {
  store.dispatch(addRequestIndicator(url));
  return Utils.MeikoFetch(url, method, body)
    .then(jsonResult => {
      store.dispatch(removeRequestIndicator(url));
      const badResponse = isObject(jsonResult) && !!jsonResult.errors;
      if (badResponse)
        store.dispatch(
          showAlertError({
            message: 'Graphql Error',
            detail: jsonResult.errors[0] && jsonResult.errors[0].message
          })
        );
      return jsonResult;
    })
    .catch(error => {
      store.dispatch(removeRequestIndicator(url));
      console.log('erza error', error);
    });
};

export default fetchFromServer;
