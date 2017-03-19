import update from 'immutability-helper';
import { ADD_ANIME } from '../constants/actions'
import { createReducer } from './utils'

const addAnime = (state, action) => {
  return update(state, {
    byId: {
      [action.item.id]: { $set: action.item }
    },
    allIds: { $push: [action.item.id] }
  })
}

const anime = createReducer({ byId: {}, allIds: [] }, {
    [ADD_ANIME] : addAnime
});

export default anime
