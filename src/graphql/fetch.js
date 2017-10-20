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

const setOptions = (method, body) => {
  const hasBody = !!body
  const isFile = hasBody && !!body.image && (body.image instanceof File)
  const requestBody = !hasBody
    ? body
    : !isFile
      ? JSON.stringify(body)
      : (() => {
        const fd = new FormData()
        fd.append("image", body.image)
        return fd
      })()

  return ({
    method: method,
    body: requestBody,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  })
}

const fetchFromServer = (url, method = 'GET', body = null) => {
  const options = setOptions(method, body);
  return fetch(url, options)
    .then(response => response.json())
    .catch(error => handleErrorResponse(error));
}

export default fetchFromServer
