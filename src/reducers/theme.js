import {SET_THEME_CLASS} from '../constants/actions'
import {Strings} from '../constants/values'
import {getUserSettings, persistUserSettings} from '../utils/common'

const getUserTheme = () => {
  const settings = getUserSettings();
  if (!settings || !settings.theme) return Strings.themes[0];
  return settings.theme;
}

const persistUserThemeChoice = (state, action) => {
  persistUserSettings({ theme: action.theme });
  return action.theme;
}

export const theme = (state = getUserTheme(), action) => {
  switch(action.type) {
    case SET_THEME_CLASS: return persistUserThemeChoice(state, action);
    default: return state;
  }
}
