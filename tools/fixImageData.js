const fs = require('fs');
const { writeOut, pathFix } = require('./utils');

async function readDb() {
  const name = './store/offline_db.json';
  const filename = pathFix(__dirname, name);
  const result = fs.readFileSync(filename, 'utf-8');
  const json = JSON.parse(result);

  const isProcessed = json instanceof Array;

  if (isProcessed) {
    return json;
  }

  const processedData = json.data.reduce((p, c) => {
    const source = c.sources.find((s) => s.includes('myanimelist'));
    if (!source) {
      return p;
    }

    return [
      ...p,
      {
        id: Number(source.split('/').pop()),
        image: c.picture,
        names: c.synonyms.map((x) => x.toLowerCase()),
        source
      }
    ];
  }, []);

  await writeOut(name, processedData);
  return processedData;
}

async function readBadImageData() {
  const filename = pathFix(__dirname, './output/bad_images.json');
  const result = fs.readFileSync(filename, 'utf-8');

  return JSON.parse(result);
}

module.exports = async function exportImageData() {
  const db = await readDb();
  const { type, isAdult, data } = await readBadImageData();
  const results = [];

  for (let series of data) {
    const entry = db.find((x) => x.id === series.malId);

    if (!entry) {
      console.warn(
        `Could not find Db entry for Id: ${series.malId} (${series.title})`
      );

      continue;
    }

    // if (!entry.names.includes(series.title.toLowerCase())) {
    //   console.warn(
    //     `Db entry did not contain series name:
    //     ${entry.names.join('\n\r')}.

    //     Series Name: (${series.title})`
    //   );
    // }

    results.push({
      ...series,
      newImage: entry.image
    });
  }

  await writeOut(`${type}_${isAdult ? 'adult' : ''}_good_images`, results);
};
