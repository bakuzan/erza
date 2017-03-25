import update from 'immutability-helper';
import { ADD_ANIME, UPDATE_ANIME } from '../constants/actions'
import { createReducer } from './utils'

// test
const testObj = {
  0: {
    id: 0,
    title: 'abc',
    status: 1,
    updateDate: new Date(2017, 0, 1).toISOString()
  },
  1: {
    id: 1,
    title: 'zab',
    status: 1,
    updateDate: new Date(2017, 2, 25).toISOString()
  },
  2: {
    id: 2,
    title: 'mno',
    status: 1,
    updateDate: new Date(2013, 0, 1).toISOString()
  }
}
// test

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

const anime = createReducer({ byId: testObj, allIds: [0, 1, 2] }, {
    [ADD_ANIME] : addAnime,
    [UPDATE_ANIME] : updateById
});

export default anime
