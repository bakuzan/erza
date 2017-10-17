const imgur = require('imgur')
imgur.setCredentials(process.env.IMGUR_USERNAME, process.env.IMGUR_PASSWORD);

function upload({ body: url }, res) {
  imgur.uploadUrl(url, process.env.IMGUR_ALBUM)
       .then(returnImgurUrl(res))
       .catch(returnImgurError(res));
}

function uploadFromLocal({ body: file }, res) {
  imgur.uploadFile(file, process.env.IMGUR_ALBUM)
       .then(returnImgurUrl(res))
       .catch(returnImgurError(res));
}

function returnImgurUrl(res) {
  return function(json) {
    res.jsonp({
      success: true,
      url: json.data.link
    });
  }
}

function returnImgurError(res) {
  return function(error) {
    console.error(error.message);
    handleErrorResponse(error, res)
  }
}

module.exports = {
  upload,
  uploadFromLocal
}
