const chalk = require('chalk');
const imgur = require('imgur');

imgur.setCredentials(process.env.IMGUR_USERNAME, process.env.IMGUR_PASSWORD);

// Helpers
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

// Helpers END

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

async function uploadUrl(image) {
  try {
    const response = await imgur.uploadUrl(image, process.env.IMGUR_ALBUM);

    return {
      success: true,
      url: response.data.link
    };
  } catch (e) {
    return { success: false, error: e };
  }
}

module.exports = {
  upload,
  uploadFromLocal,
  uploadUrl
};
