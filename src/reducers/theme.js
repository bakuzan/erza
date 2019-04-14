import { SET_THEME_CLASS, TOGGLE_TIMED_THEME } from '../constants/actions';
import { Strings } from '../constants/values';
import { userSettings } from '../utils/storage';
import { createReducer } from './utils';

function getUserTheme() {
  const settings = userSettings.get();

  if (!settings || !settings.theme) {
    return { value: Strings.themes[0].value, isTimed: false };
  }

  return settings.theme;
}

function persistUserThemeChoice(state, action) {
  const updatedSettings = userSettings.set({
    theme: { ...state, value: action.theme }
  });
  return updatedSettings.theme;
}

function persistUserTimedSetting(state) {
  const updatedSettings = userSettings.set({
    theme: { ...state, isTimed: !state.isTimed }
  });
  return updatedSettings.theme;
}

export const theme = createReducer(getUserTheme(), {
  [SET_THEME_CLASS]: persistUserThemeChoice,
  [TOGGLE_TIMED_THEME]: persistUserTimedSetting
});
