export const Paths = {
  build: (path, params) => {
    let hasSearch = false;
    for(let k in params) {
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
  base: '/erza/',
  home: '',
  anime: {
    list: 'anime-list/',
    view: 'anime-view/',
    create: 'anime/create',
    edit: 'anime/edit/'
  },
  graphql: {
    base: '/graphql?query='
  }
}
