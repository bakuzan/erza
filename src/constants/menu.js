import {Paths} from './paths'
import {Strings} from './values'

const Menu = [
  {
    id: 0,
    title: 'Anime',
    children: [
      {
        id: 0,
        link: `${Paths.base}${Paths.anime.create}`,
        title: 'Create an Anime',
        description: 'Enter details about a new anime entry.'
      },
      {
        id: 1,
        link: `${Paths.base}${Paths.anime.list}${Strings.filters.ongoing}`,
        title: 'Browse Anime',
        description: 'Search anime with a variable of filters and conditions'
      }
    ]
  },
  {
    id: 1,
    title: 'History',
    children: [
      {
        id: 2,
        link: `${Paths.base}${Paths.history}anime`,
        title: 'Recent anime history',
        description: 'View anime history by data range.'
      },
      {
        id: 3,
        link: `${Paths.base}${Paths.history}manga`,
        title: 'Recent manga history',
        description: 'View manga history by data range.'
      }
    ]
  }
]

export default Menu;
