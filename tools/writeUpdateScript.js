const fs = require('fs');
const { writeOut, pathFix, readImageData } = require('./utils');

module.exports = async function writeUpdateScript(type, isAdult) {
  const items = await readImageData('uploaded_images', type, isAdult);
  let output = '';

  for (let item of items) {
    output += `UPDATE ${type}s SET image = '${item.image}' WHERE id = ${item.id};`;
    output += `\r`;
  }

  await writeOut(
    `./output/${type}_${isAdult ? 'adult' : ''}_script.sql`,
    output,
    false
  );
};
