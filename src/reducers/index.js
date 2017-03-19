import { combineReducers } from 'redux'
import { routerReducer as routing } from 'react-router-redux'
import anime from './anime'

const entities = combineReducers({
  anime
})

const rootReducer = combineReducers({
  routing,
  entities
})

export default rootReducer
