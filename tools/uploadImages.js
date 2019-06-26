const fs = require('fs');
const { query, writeOut, pathFix } = require('./utils');

async function readImageData(type, isAdult) {
  const filename = pathFix(
    __dirname,
    `./output/${type}_${isAdult ? 'adult' : ''}_good_images.json`
  );

  const result = fs.readFileSync(filename, 'utf-8');

  return JSON.parse(result);
}

async function upload(image) {
  return await query(`/api/image-upload/url`, {
    image
  });
}

module.exports = async function uploadImages(type, isAdult) {
  const items = await readImageData(type);
  const results = [];

  for (let item of items) {
    const { image, newImage, ...pass } = item;
    const response = await upload(newImage);
    console.log(response);
    if (response.success) {
      results.push({ ...pass, image: response.url });
    } else {
      console.log(`Failed to upload image for ${item.title}`);

      if (response.error.message.code === 429) {
        console.log(`Breaking.`);
        console.log(response.error.message.message);
        break;
      }
    }
  }

  await writeOut(`${type}_${isAdult ? 'adult' : ''}_uploaded_images`, results);
};
