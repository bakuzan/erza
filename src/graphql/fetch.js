import toaster from '../utils/toaster'

const handleErrorResponse = error => {
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
  body: !!body ? JSON.stringify(body) : body,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
})

const fetchFromServer = (url, method = 'GET', body = null) => {
  const options = setOptions(method, body);
  return fetch(url, options)
    .then(response => response.json())
    .catch(error => handleErrorResponse(error));
}

export default fetchFromServer
