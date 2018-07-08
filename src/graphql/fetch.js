import { Utils } from 'meiko';
import {
  addRequestIndicator,
  removeRequestIndicator
} from '../actions/request-indicator';
import { showAlertError } from '../actions/alert';

import { store } from '../index';

const fetchFromServer = (url, method = 'GET', body = null) => {
  store.dispatch(addRequestIndicator(url));
  return Utils.MeikoFetch(url, method, body)
    .then(jsonResult => {
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
    });
};

export default fetchFromServer;
