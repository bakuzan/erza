const chalk = require('chalk');
const imgur = require('imgur');

imgur.setCredentials(process.env.IMGUR_USERNAME, process.env.IMGUR_PASSWORD);

function upload({ body: { image } }, res) {
  imgur
    .uploadUrl(image, process.env.IMGUR_ALBUM)
    .then(returnImgurUrl(res))
    .catch(returnImgurError(res));
}

function uploadFromLocal({ body: { image } }, res) {
  const [_, base64] = image.split(',');
  imgur
    .uploadBase64(base64, process.env.IMGUR_ALBUM)
    .then(returnImgurUrl(res))
    .catch(returnImgurError(res));
}

function returnImgurUrl(res) {
  return function(json) {
    res.jsonp({
      success: true,
      url: json.data.link
    });
  };
}

function returnImgurError(res) {
  return function(error) {
    console.error(chalk.bgRed.white.bold(error.message));
    const data = { success: false, error };
    return res ? res.status(400).send(data) : data;
  };
}

module.exports = {
  upload,
  uploadFromLocal
};
