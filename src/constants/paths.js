export const Paths = {
  build: (path, params) => {
    let hasSearch = false;
    for (let k in params) {
      if (params.hasOwnProperty(k)) {
        if (k === 'search') {
          hasSearch = true;
          continue;
        }
        path = path.replace(`:${k}`, params[k]);
      }
    }
    const searchValue = hasSearch ? `?search=${params.search}` : '';
    return `${path}${searchValue}`;
  },
  base: '/erza',
  home: '',
  anime: {
    list: '/anime-list/',
    view: '/anime-view/',
    create: '/anime/create',
    edit: '/anime/edit/'
  },
  manga: {
    list: '/manga-list/',
    view: '/manga-view/',
    create: '/manga/create',
    edit: '/manga/edit/'
  },
  history: '/history/',
  statistics: '/statistics/',
  tagManagement: '/tag-management/',
  graphql: {
    base: '/graphql?query='
  },
  malSearch: '/api/mal-search/:type',
  sunrise_sunset:
    'https://api.sunrise-sunset.org/json?lat=51.9451597&lng=-0.6565607&formatted=0',
  imgur: {
    postUrl: '/api/image-upload/url',
    postFile: '/api/image-upload/file'
  }
};

export const ForceNavigate = {
  forceNavigate: true
};
