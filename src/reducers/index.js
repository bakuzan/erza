import { combineReducers } from 'redux'
import { routerReducer as routing } from 'react-router-redux'
import anime from './anime'
import {isFetching} from './general-ui'

const entities = combineReducers({
  anime
})

const rootReducer = combineReducers({
  routing,
  entities,
  isFetching
})

export default rootReducer
