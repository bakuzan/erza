const {
  query: medQuery,
  writeOut: medWrite,
  pathFix,
  readIn
} = require('medea');

async function query(endpoint, body) {
  try {
    const response = await medQuery(
      `${process.env.CLI_API_ENDPOINT}${endpoint}`,
      {
        body: JSON.stringify({
          ...body
        })
      }
    );

    if (!response.success) {
      const error = response.error;
      console.log(`Bad Response.\n\r${error.message}`);
      process.exit(1);
    }

    // Query resolve names are being aliased to 'value'
    const { value } = response.data;
    return value ? value : response.data;
  } catch (e) {
    console.log(`Fetch failed.\n\r${e.message}`);
    process.exit(1);
  }
}

const HAS_EXT = /\w\.\w{3,4}$/;

async function writeOut(name, data, isjson = true) {
  const pathending = name.match(HAS_EXT) ? name : `./output/${name}.json`;
  const fileName = pathFix(__dirname, pathending);
  const fileData = isjson ? JSON.stringify(data, null, 2) : data;

  return await medWrite(fileName, fileData);
}

async function readImageData(coreName, type, isAdult) {
  const filename = pathFix(
    __dirname,
    `./output/${type}_${isAdult ? 'adult' : ''}_${coreName}.json`
  );

  const result = await readIn(filename);
  if (result.success) {
    return JSON.parse(result.data);
  } else {
    console.error(result.error);
    process.exit(1);
  }
}

module.exports = {
  query,
  writeOut,
  readImageData,
  capitalise: (str) => str.charAt(0).toUpperCase() + str.slice(1)
};
