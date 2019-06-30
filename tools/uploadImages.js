const { pathFix, readIn } = require('medea');
const { query, writeOut, readImageData } = require('./utils');

async function upload(image) {
  return await query(`/api/image-upload/url`, {
    image
  });
}

module.exports = async function uploadImages(type, isAdult) {
  const items = await readImageData('good_images', type, isAdult);
  const results = [];

  for (let item of items) {
    const { image, newImage, ...pass } = item;
    const response = await upload(newImage);

    if (response.success) {
      console.log(`Uploaded ${item.title} image.`);
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
