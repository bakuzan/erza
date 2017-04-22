import { combineReducers } from 'redux'
import { routerReducer as routing } from 'react-router-redux'
import anime from './anime'
import tags from './tags'
import {isFetching} from './loading'
import {isAdult} from './is-adult'
import {sorting} from './sorting'
import {paging} from './paging'
import {theme} from './theme'

const entities = combineReducers({
  anime,
  tags
})

const rootReducer = combineReducers({
  routing,
  entities,
  isFetching,
  isAdult,
  sorting,
  paging,
  theme
})

export default rootReducer
