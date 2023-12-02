const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');
const { Readable } = require('stream');
const { finished } = require('stream/promises');
const { v4: uuidV4 } = require('uuid');

// imgur.setCredentials(process.env.IMGUR_USERNAME, process.env.IMGUR_PASSWORD);

// Helpers
// function returnImgurUrl(res) {
//   return function (json) {
//     res.jsonp({
//       success: true,
//       url: json.data.link
//     });
//   };
// }

// function returnImgurError(res) {
//   return function (error) {
//     console.error(chalk.bgRed.white.bold(error.message));
//     const data = { success: false, error };
//     return res ? res.status(400).send(data) : data;
//   };
// }

// Helpers END

// function upload({ body: { image } }, res) {
//   imgur
//     .uploadUrl(image, process.env.IMGUR_ALBUM)
//     .then(returnImgurUrl(res))
//     .catch(returnImgurError(res));
// }

// function uploadFromLocal({ body: { image } }, res) {
//   const [_, base64] = image.split(',');
//   imgur
//     .uploadBase64(base64, process.env.IMGUR_ALBUM)
//     .then(returnImgurUrl(res))
//     .catch(returnImgurError(res));
// }

// async function uploadUrl(image) {
//   try {
//     const response = await imgur.uploadUrl(image, process.env.IMGUR_ALBUM);

//     return {
//       success: true,
//       url: response.data.link
//     };
//   } catch (e) {
//     return { success: false, error: e };
//   }
// }

async function get(req, res) {
  const imageKey = req.params.key;
  const imagePath = path.resolve(process.env.IMAGE_FOLDER, `${imageKey}.jpg`);

  try {
    // Check exists
    await fsp.access(imagePath, fs.constants.R_OK);

    res.sendFile(imagePath);
  } catch (e) {
    // If file failed (doesn't exist?) return fallback image
    res.sendFile(
      path.resolve(__dirname, '..', '..', 'public', 'dead-image.PNG')
    );
  }
}

async function saveImageToFile(imageUrl) {
  const imageKey = uuidV4();
  const imagePath = path.resolve(process.env.IMAGE_FOLDER, `${imageKey}.jpg`);

  try {
    const stream = fs.createWriteStream(imagePath);
    const downloadResponse = await fetch(imageUrl);
    await finished(Readable.fromWeb(downloadResponse.body).pipe(stream));
    return { success: true, image: imageKey };
  } catch (e) {
    return { success: false, error: e };
  }
}

// Checks
function canSaveImage(maybeImageUrl) {
  if (!maybeImageUrl) {
    return false;
  }

  return !maybeImageUrl.includes('imgur') && maybeImageUrl.startsWith('http');
}

module.exports = {
  get,
  saveImageToFile,
  // Checks
  canSaveImage
};
