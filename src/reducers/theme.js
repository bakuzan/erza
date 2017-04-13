import {SET_THEME_CLASS} from '../constants/actions'
import {Strings} from '../constants/values'

const getUserSettings = () => JSON.parse(localStorage.getItem(Strings.localUserSettings)) || null;

const getUserTheme = () => {
  const settings = getUserSettings();
  if (!settings || !settings.theme) return Strings.themes[0];
  return settings.theme;
}

const persistUserThemeChoice = (state, action) => {
  const settings = getUserSettings();
  const updated = Object.assign({}, settings, { theme: action.theme });
  localStorage.setItem(Strings.localUserSettings, JSON.stringify(updated));
  return action.theme;
}


export const theme = (state = getUserTheme(), action) => {
  switch(action.type) {
    case SET_THEME_CLASS: return persistUserThemeChoice(state, action);
    default: return state;
  }
}
