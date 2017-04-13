import {SET_THEME_CLASS} from '../constants/actions'
import {Strings} from '../constants/values'

export const theme = (state = Strings.themeOne, action) => {
  switch(action.type) {
    case SET_THEME_CLASS: return action.theme;
    default: return state;
  }
}
