import {Paths} from './paths'
import {Strings} from './values'

const MENU = [
  { 
    title: 'Anime', 
    children: [
      { 
        link: `${Paths.base}${Paths.anime.create}`, 
        title: 'Create an Anime', 
        description: 'Enter details about a new anime entry.' 
      },
      { 
        link: `${Paths.base}${Paths.anime.list}${Strings.filters.ongoing}`, 
        title: 'Browse Anime', 
        description: 'Search anime with a variable of filters and conditions' 
      }
    ] 
  },
  {
    title: 'History',
    children: [
      { 
        link: `${Paths.base}${Paths.history}anime`,
        title: 'Recent anime history',
        description: 'View anime history by data range.'
      },
      { 
        link: `${Paths.base}${Paths.history}manga`,
        title: 'Recent manga history',
        description: 'View manga history by data range.'
      }
    ]
  }
]

export default Menu;
