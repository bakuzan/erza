const fs = require('fs');
const { writeOut, pathFix } = require('./utils');

async function readImageData(type, isAdult) {
  const filename = pathFix(
    __dirname,
    `./output/${type}_${isAdult ? 'adult' : ''}_uploaded_images.json`
  );

  const result = fs.readFileSync(filename, 'utf-8');

  return JSON.parse(result);
}

module.exports = async function writeUpdateScript(type, isAdult) {
  const items = await readImageData(type);
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
