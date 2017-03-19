import { ADD_ANIME } from '../constants/actions'
import {dispatch} from 'redux'

export const addAnime = (item) => ({
  type: ADD_ANIME,
  item
})

export const createAnime = (form) => {
  console.log(form);
  return function() {
    dispatch(addAnime({ id: 0, title: 'fake item' }))
  }
}
