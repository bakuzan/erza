import update from 'immutability-helper';
import { ADD_ANIME, UPDATE_ANIME } from '../constants/actions'
import { createReducer } from './utils'

const updateById = (state, action) => {
  return update(state, {
    byId: {
      [action.item.id]: { $set: action.item }
    }
  })
}

const addAnime = (state, action) => {
  const updatedById = updateById(state, action);
  return update(updatedById, {
    allIds: { $push: [action.item.id] }
  })
}

const anime = createReducer({ byId: {}, allIds: [] }, {
    [ADD_ANIME] : addAnime,
    [UPDATE_ANIME] : updateById
});

export default anime
