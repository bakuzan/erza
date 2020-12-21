const appName = 'erza';
const whitelist = /^.*localhost:\d{4}/;

const seasons = Object.freeze({
  winter: 'Winter',
  spring: 'Spring',
  summer: 'Summer',
  autumn: 'Autumn'
});

const seasonMonths = Object.freeze(['01', '04', '07', '10']);

const type = Object.freeze({
  anime: 'anime',
  manga: 'manga',
  chapter: 'chapter',
  episode: 'episode'
});

const environment = Object.freeze({
  development: 'development',
  production: 'production'
});

const dayNames = Object.freeze([
  'Sun',
  'Mon',
  'Tue',
  'Wed',
  'Thu',
  'Fri',
  'Sat'
]);

const paths = Object.freeze({
  imgur: {
    postFile: '/api/image-upload/file'
  }
});

module.exports = {
  appName,
  whitelist,
  seasons,
  seasonMonths,
  type,
  environment,
  dayNames,
  paths
};
