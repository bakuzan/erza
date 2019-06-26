const fs = require('fs');
const argv = require('minimist')(process.argv.slice(2));
const dotenv = require('dotenv');
dotenv.config();

const { pathFix } = require('./utils');
const exportImageData = require('./exportImageData');
const fixImageData = require('./fixImageData');
const uploadImages = require('./uploadImages');
const writeScript = require('./writeUpdateScript');

const seriesTypes = ['anime', 'manga'];

function validate(fn, message) {
  if (!fn()) {
    message();
    process.exit(0);
  }
}

function fileCheck(filename) {
  const location = pathFix(__dirname, filename);
  try {
    fs.accessSync(location, fs.constants.R_OK);
    return true;
  } catch (e) {
    console.log(
      `Failed to access ${filename}.\n\rCheck the file exist and you have read permission access.`
    );

    return false;
  }
}

async function run() {
  console.log('***** Erza cli *****');
  const keys = Object.keys(argv);
  const { help } = argv;

  if (help || keys.length === 1) {
    console.log(`
    * * * * * * * * * * * * * * * * * * * * * * * * *
    * Options
    * * * * * * * * * * * * * * * * * * * * * * * * *
    * 
    * --export-images anime/manga (defaults: anime)
    * 
    * Shortcut: -ei
    * Description: Export series with potentially bad images
    * Addition args:
    * 
    *   --isAdult 
    *   Description: Run process for adult series
    * 
    * * * * * * * * * * * * * * * * * * * * * * * * *
    * 
    * --update-images 
    * 
    * Shortcut: -ui
    * Description: Update images of current bad_images file
    * 
    * * * * * * * * * * * * * * * * * * * * * * * * * 
    * 
    * --upload-images anime/manga (defaults: anime)
    * 
    * Shortcut: -img
    * Description: Upload good_images file to imgur
    * Addition args:
    * 
    *   --isAdult 
    *   Description: Run process for adult series
    *
    * * * * * * * * * * * * * * * * * * * * * * * * * 
    * 
    * --write-script anime/manga (defaults: anime)
    * 
    * Shortcut: -ws
    * Description: Write script to update db
    * Addition args:
    * 
    *   --isAdult 
    *   Description: Run process for adult series
    * 
    `);

    process.exit(0);
  }

  const imgExport = argv['export-images'] || argv.ei;
  if (imgExport) {
    const isBool = typeof imgExport === 'boolean';

    validate(
      () => seriesTypes.includes(imgExport) || isBool,
      () =>
        console.log(`
        Invalid args supplied to image export (${imgExport}).
        Expected "anime", "manga", or nothing (default: "anime").`)
    );

    const type = isBool ? 'anime' : imgExport;
    const isAdult = argv.isAdult || false;
    await exportImageData(type, isAdult);
  }

  const updateImages = argv['update-images'] || argv.ui;
  if (updateImages) {
    validate(
      () =>
        fileCheck('./output/bad_images.json') &&
        fileCheck('./store/offline_db.json'),
      () =>
        console.log(`Data file(s) were inaccessible. Cancelling update-images`)
    );

    await fixImageData();
  }

  const upload = argv['upload-images'] || argv.img;
  if (upload) {
    const isBool = typeof upload === 'boolean';

    validate(
      () => seriesTypes.includes(upload) || isBool,
      () =>
        console.log(`
        Invalid args supplied to image export (${upload}).
        Expected "anime", "manga", or nothing (default: "anime").`)
    );

    const type = isBool ? 'anime' : upload;
    const isAdult = argv.isAdult || false;

    validate(
      () =>
        fileCheck(
          `./output/${type}_${isAdult ? 'adult' : ''}_good_images.json`
        ),
      () =>
        console.log(`Data file(s) were inaccessible. Cancelling upload-images`)
    );

    await uploadImages(type, isAdult);
  }

  const write = argv['write-script'] || argv.ws;
  if (write) {
    const isBool = typeof write === 'boolean';

    validate(
      () => seriesTypes.includes(write) || isBool,
      () =>
        console.log(`
        Invalid args supplied to image export (${write}).
        Expected "anime", "manga", or nothing (default: "anime").`)
    );

    const type = isBool ? 'anime' : write;
    const isAdult = argv.isAdult || false;

    validate(
      () =>
        fileCheck(
          `./output/${type}_${isAdult ? 'adult' : ''}_uploaded_images.json`
        ),
      () =>
        console.log(`Data file(s) were inaccessible. Cancelling upload-images`)
    );

    await writeScript(type, isAdult);
  }
}

run();
