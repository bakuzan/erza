import { combineReducers } from 'redux'
import { routerReducer as routing } from 'react-router-redux'
import anime from './anime'
import {isFetching} from './loading'
import {sorting} from './sorting'
import {paging} from './paging'

const entities = combineReducers({
  anime
})

const rootReducer = combineReducers({
  routing,
  entities,
  isFetching,
  sorting,
  paging
})

export default rootReducer
