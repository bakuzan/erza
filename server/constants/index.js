const appName = 'erza';
const whitelist = /^.*localhost:\d{4}/;

const seasons = {
  winter: 'Winter',
  spring: 'Spring',
  summer: 'Summer',
  fall: 'Fall'
};

const seasonMonths = ['01', '04', '07', '10'];

const type = {
  anime: 'anime',
  manga: 'manga',
  chapter: 'chapter',
  episode: 'episode'
};

const environment = {
  development: 'development',
  production: 'production'
};

const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const paths = {
  imgur: {
    postFile: '/api/image-upload/file'
  }
};

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
