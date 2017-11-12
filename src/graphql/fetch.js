import toaster from '../utils/toaster'
import {addRequestIndicator, removeRequestIndicator} from '../actions/request-indicator'
import {store} from '../index'

const handleErrorResponse = (error, url) => {
  store.dispatch(removeRequestIndicator(url))
  const message = error.message
                    ? error.message
                    : error.error
                      ? error.error
                      : error
                        ? error
                        : 'Something went wrong!';
  toaster.error('Fetch error!', message);
  console.error(error);
}

const setOptions = (method, body) => ({
  method: method,
  body: !!body ? JSON.stringify(body) : null,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
})

const fetchFromServer = (url, method = 'GET', body = null) => {
  store.dispatch(addRequestIndicator(url))
  const options = setOptions(method, body);
  return fetch(url, options)
    .then(response => {
      store.dispatch(removeRequestIndicator(url))
      return response.json()
    })
    .catch(error => handleErrorResponse(error, url));
}

export default fetchFromServer
