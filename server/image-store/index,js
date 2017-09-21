const imgur = require('imgur')
imgur.setCredentials(process.env.IMGUR_USERNAME, process.env.IMGUR_PASSWORD);

function upload(url) {
  imgur.uploadUrl(url, process.env.IMGUR_ALBUM)
       .then((json) => console.log(json.data.link))
       .catch((err) => console.error(err.message));
}

function uploadFromLocal(file) {
  imgur.uploadFile(file, process.env.IMGUR_ALBUM)
       .then((json) => console.log(json.data.link))
       .catch((err) => console.error(err.message));
}

module.exports = {
  upload,
  uploadFromLocal
}
