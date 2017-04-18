import {SET_THEME_CLASS, TOGGLE_TIMED_THEME} from '../constants/actions'
import {Strings} from '../constants/values'
import {getUserSettings, persistUserSettings} from '../utils/common'
import {createReducer} from './utils'

const getUserTheme = () => {
  const settings = getUserSettings();
  if (!settings || !settings.theme) return { class: Strings.themes[0].class, isTimed: false };
  return settings.theme;
}

const persistUserThemeChoice = (state, action) => {
  return persistUserSettings({
    theme: { ...state, class: action.theme }
  });
}

const persistUserTimedSetting = (state, action) => {
  return persistUserSettings({
    theme: { ...state, isTimed: !state.isTimed }
  });
}

export const theme = createReducer(getUserTheme(), {
  [SET_THEME_CLASS]     : persistUserThemeChoice(state, action);
  [TOGGLE_TIMED_THEME]  : persistUserTimedSetting(state, action);
}
