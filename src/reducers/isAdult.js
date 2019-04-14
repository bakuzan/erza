import { TOGGLE_IS_ADULT } from '../constants/actions';
import { userSettings } from '../utils/storage';

function getUserIsAdult() {
  const settings = userSettings.get();
  if (!settings || !settings.isAdult) {
    return false;
  }
  return settings.isAdult;
}

function persistIsAdultChoice(_, action) {
  userSettings.set({ isAdult: action.isAdult });
  return action.isAdult;
}

export const isAdult = (state = getUserIsAdult(), action) =>
  action.type === TOGGLE_IS_ADULT
    ? persistIsAdultChoice(state, { isAdult: !state })
    : state;
