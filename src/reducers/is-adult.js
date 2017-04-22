import { TOGGLE_IS_ADULT } from '../constants/actions'

export const isAdult = (state = false, action) => action.type === TOGGLE_IS_ADULT ? !state : state;
