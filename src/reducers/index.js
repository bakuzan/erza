import { combineReducers } from 'redux'
import { routerReducer as routing } from 'react-router-redux'
import anime from './anime'
import tags from './tags'
import {isFetching} from './loading'
import {sorting} from './sorting'
import {paging} from './paging'

const entities = combineReducers({
  anime,
  tags
})

const rootReducer = combineReducers({
  routing,
  entities,
  isFetching,
  sorting,
  paging
})

export default rootReducer
