import { TOGGLE_IS_ADULT } from '../constants/actions'
import {getUserSettings, persistUserSettings} from '../utils/common'

const getUserIsAdult = () => {
  const settings = getUserSettings();
  if (!settings || !settings.isAdult) return false;
  return settings.isAdult;
}

const persistIsAdultChoice = (state, action) => {
  persistUserSettings({ isAdult: action.isAdult });
  return action.isAdult;
}

export const isAdult = (state = getUserIsAdult(), action) => action.type === TOGGLE_IS_ADULT
  ? persistIsAdultChoice(state, { isAdult: !state })
  : state;
