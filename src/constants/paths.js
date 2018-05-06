import { Constants } from 'meiko';

export const Paths = {
  ...Constants.Urls,
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
