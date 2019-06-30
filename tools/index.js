const { createClient, accessAsync, pathFix } = require('medea');
const dotenv = require('dotenv');
dotenv.config();

const exportImageData = require('./exportImageData');
const fixImageData = require('./fixImageData');
const uploadImages = require('./uploadImages');
const writeScript = require('./writeUpdateScript');

const seriesTypes = ['anime', 'manga'];

async function validate(fn, message) {
  const passed = await fn();
  if (!passed) {
    message();
    process.exit(0);
  }
}

async function fileCheck(filename) {
  const location = pathFix(__dirname, filename);
  try {
    await accessAsync(location);

    return true;
  } catch (e) {
    console.log(
      `Failed to access ${filename}.
      Check the file exist and you have read permission access.`
    );

    return false;
  }
}

async function run() {
  const windowColumns = process.stdout.columns || 80;

  const cli = createClient('Erza', { windowColumns })
    .addOption({
      option: 'export-images',
      shortcut: 'ei',
      description: `Export series with potentially bad images.
    Either "anime" or "manga", defaults to "anime"`,
      validate: (_, value) => seriesTypes.includes(value) || value === true
    })
    .addOption({
      option: 'update-images',
      shortcut: 'ui',
      description: 'Update images of current bad_images file'
    })
    .addOption({
      option: 'upload-images',
      shortcut: 'img',
      description: `Upload good_images file to imgur.
      Either "anime" or "manga", defaults to "anime"`,
      validate: (_, value) => seriesTypes.includes(value) || value === true
    })
    .addOption({
      option: 'write-script',
      shortcut: 'ws',
      description: `Write script to update db.
      Either "anime" or "manga", defaults to "anime"`,
      validate: (_, value) => seriesTypes.includes(value) || value === true
    })
    .addOption({
      option: 'isAdult',
      shortcut: 'a',
      description: 'Run process for adult series'
    })
    .parse(process.argv)
    .welcome();

  if (!cli.any()) {
    cli.helpText();
    process.exit(0);
  }

  if (cli.has('export-images')) {
    const imgExport = cli.get('export-images');

    await validate(
      async () => cli.validate('export-images'),
      () =>
        console.log(`
        Invalid args supplied to image export (${imgExport}).
        Expected "anime", "manga", or nothing (default: "anime").`)
    );

    const type = typeof imgExport === 'boolean' ? 'anime' : imgExport;
    const isAdult = cli.get('isAdult', false);
    await exportImageData(type, isAdult);
    process.exit(0);
  }

  if (cli.has('update-images')) {
    await validate(
      async () =>
        (await fileCheck('./output/bad_images.json')) &&
        (await fileCheck('./store/offline_db.json')),
      () =>
        console.log(`Data file(s) were inaccessible. Cancelling update-images`)
    );

    await fixImageData();
    process.exit(0);
  }

  if (cli.has('upload-images')) {
    const upload = cli.get('upload-images');

    await validate(
      async () => cli.validate('upload-images'),
      () =>
        console.log(`
        Invalid args supplied to image export (${upload}).
        Expected "anime", "manga", or nothing (default: "anime").`)
    );

    const type = typeof upload === 'boolean' ? 'anime' : upload;
    const isAdult = cli.get('isAdult', false);

    await validate(
      async () =>
        await fileCheck(
          `./output/${type}_${isAdult ? 'adult' : ''}_good_images.json`
        ),
      () =>
        console.log(`Data file(s) were inaccessible. Cancelling upload-images`)
    );

    await uploadImages(type, isAdult);
    process.exit(0);
  }

  if (cli.has('write-script')) {
    const write = cli.get('write-script');

    await validate(
      async () => cli.validate('write-script'),
      () =>
        console.log(`
        Invalid args supplied to image export (${write}).
        Expected "anime", "manga", or nothing (default: "anime").`)
    );

    const type = typeof write === 'boolean' ? 'anime' : write;
    const isAdult = cli.get('isAdult', false);

    await validate(
      async () =>
        await fileCheck(
          `./output/${type}_${isAdult ? 'adult' : ''}_uploaded_images.json`
        ),
      () =>
        console.log(`Data file(s) were inaccessible. Cancelling upload-images`)
    );

    await writeScript(type, isAdult);
    process.exit(0);
  }

  console.log('Invalid cli run.');
  console.log('Run without args to get help.');
}

run();
