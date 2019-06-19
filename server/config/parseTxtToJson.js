const fs = require('fs');

function tryParseJSON(jsonString) {
  try {
    const o = JSON.parse(jsonString);
    if (o && typeof o === 'object') {
      return o;
    }
  } catch (e) {}
  return false;
}

function parseTxtToJson(text) {
  const result = [];
  const objects = text.split('\n');

  for (let i = 0, length = objects.length; i < length; i++) {
    const obj = objects[i];
    if (!obj) {
      continue;
    }

    const json = tryParseJSON(obj);
    if (json) {
      result.push(json);
    }
  }

  return result;
}

async function run() {
  const inputDir = './data';
  const outputDir = './data';
  const fileNames = ['anime', 'manga', 'episode', 'chapter', 'tag'];

  fileNames.forEach(async (name) => {
    console.log(`Processing: ${name}`);
    const text = await fs.readFileSync(`${inputDir}/${name}.txt`, 'utf-8');
    const json = parseTxtToJson(text);
    const data = JSON.stringify(json, null, 2);
    await fs.writeFileSync(`${outputDir}/${name}.json`, data, 'utf-8');
    console.log(`Written: ${name}.json`);
  });
}

run()
  .then(() => console.log('Done'))
  .catch((err) => console.log('Failed', err));
