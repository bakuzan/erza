const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

async function query(endpoint, body) {
  try {
    const response = await fetch(`${process.env.CLI_API_ENDPOINT}${endpoint}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...body
      })
    });

    const result = await response.json();

    if (result.errors) {
      const error = result.errors[0];
      console.log(`Bad Response.\n\r${error.message}`);
      process.exit(1);
    }

    // Query resolve names are being aliased to 'value'
    return result.data ? result.data.value : result;
  } catch (e) {
    console.log(`Fetch failed.\n\r${e.message}`);
    process.exit(1);
  }
}

const HAS_EXT = /\w\.\w{3,4}$/;

function writeOut(name, data, isjson = true) {
  console.log(name);
  const pathending = name.match(HAS_EXT) ? name : `./output/${name}.json`;
  const fileName = path.resolve(path.join(__dirname, pathending));
  const fileData = isjson ? JSON.stringify(data, null, 2) : data;

  return new Promise((resolve) => {
    fs.writeFile(fileName, fileData, function(err) {
      if (err) {
        console.error(`Failed to write ${fileName}`, err);
        return resolve(false);
      }

      console.log(`Successfully written ${fileName}`);
      return resolve(true);
    });
  });
}

module.exports = {
  query,
  writeOut,
  capitalise: (str) => str.charAt(0).toUpperCase() + str.slice(1),
  pathFix: (...strs) => path.resolve(path.join(...strs))
};
