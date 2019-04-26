import { Paths } from './paths';
import { Strings } from './values';
import Enums from './enums';

const defaultStatus = Enums.status.Ongoing;
const Menu = [
  {
    id: 0,
    title: 'Anime',
    children: [
      {
        id: 1,
        link: `${Paths.base}${Paths.anime.create}`,
        title: 'Create an Anime',
        description: 'Enter details about a new anime entry.',
        icon: 'AC'
      },
      {
        id: 2,
        link: `${Paths.base}${Paths.anime.list}${defaultStatus}`,
        title: 'Browse Anime',
        description: 'Search anime with a variable of filters and conditions',
        icon: 'AL'
      }
    ]
  },
  {
    id: 1,
    title: 'Manga',
    children: [
      {
        id: 3,
        link: `${Paths.base}${Paths.manga.create}`,
        title: 'Create an Manga',
        description: 'Enter details about a new manga entry.',
        icon: 'MC'
      },
      {
        id: 4,
        link: `${Paths.base}${Paths.manga.list}${defaultStatus}`,
        title: 'Browse Manga',
        description: 'Search manga with a variable of filters and conditions',
        icon: 'ML'
      }
    ]
  },
  {
    id: 2,
    title: 'History',
    children: [
      {
        id: 5,
        link: `${Paths.base}${Paths.history}${Strings.anime}`,
        title: 'View watched',
        description: 'View anime history by data range.',
        icon: 'AH'
      },
      {
        id: 6,
        link: `${Paths.base}${Paths.history}${Strings.manga}`,
        title: 'View read',
        description: 'View manga history by data range.',
        icon: 'MH'
      }
    ]
  },
  {
    id: 3,
    title: 'Statistics',
    children: [
      {
        id: 7,
        link: `${Paths.base}${Paths.statistics}${Strings.anime}`,
        title: 'Explore anime',
        description: 'Investigate the aggregation on anime entries',
        icon: 'AS'
      },
      {
        id: 8,
        link: `${Paths.base}${Paths.statistics}${Strings.manga}`,
        title: 'Explore manga',
        description: 'Investigate the aggregation on manga entries',
        icon: 'MS'
      }
    ]
  },
  {
    id: 4,
    title: 'Tag Management',
    children: [
      {
        id: 9,
        link: `${Paths.base}${Paths.tagManagement}`,
        title: 'Tag management',
        description: 'Manage tag changes and deletion',
        icon: 'TM'
      }
    ]
  }
];

export default Menu;
