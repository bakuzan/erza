import {TOGGLE_REQUEST_INDICATOR_VISIBILITY, ADD_REQUEST_INDICATOR, REMOVE_REQUEST_INDICATOR} from '../constants/actions'


export const toggleRequestIndicatorVisibility = () => ({
  type: TOGGLE_REQUEST_INDICATOR_VISIBILITY
})

export const addRequestIndicator = payload => ({
  type: ADD_REQUEST_INDICATOR,
  payload
})

export const removeRequestIndicator = payload => ({
  type: REMOVE_REQUEST_INDICATOR,
  payload
})
