import { SET_THEME_CLASS, TOGGLE_TIMED_THEME } from '../constants/actions';

export const setApplicationTheme = theme => ({
  type: SET_THEME_CLASS,
  theme
});

export const toggleTimedTheme = () => ({
  type: TOGGLE_TIMED_THEME
});
