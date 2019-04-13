import { Urls } from 'mko';

export const Paths = {
  ...Urls,
  malSearch: '/api/mal-search/:type',
  sunrise_sunset:
    'https://api.sunrise-sunset.org/json?lat=51.9451597&lng=-0.6565607&formatted=0',
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
  tagManagement: '/tag-management/'
};

export const ForceNavigate = {
  forceNavigate: true
};
