import {
  TOGGLE_REQUEST_INDICATOR_VISIBILITY,
  ADD_REQUEST_INDICATOR,
  REMOVE_REQUEST_INDICATOR
} from '../constants/actions';
import { userSettings } from '../utils/storage';
import { createReducer } from './utils';

const initialState = {
  isHidden: false,
  requests: []
};

function getUserRequestIndicator() {
  const settings = userSettings.get();
  if (!settings || !settings.requestIndicator) {
    return initialState;
  }
  return { ...initialState, ...settings.requestIndicator };
}

function persistRequestIndicatorVisibility(state) {
  const updatedSettings = userSettings.set({
    requestIndicator: { isHidden: !state.isHidden }
  });
  return { ...state, ...updatedSettings.requestIndicator };
}

const addRequestEndpoint = (state, action) => ({
  ...state,
  requests: [...state.requests, action.payload]
});

const removeRequestEndpoint = (state, action) => ({
  ...state,
  requests: state.requests.filter((x) => x !== action.payload)
});

const requestIndicator = createReducer(getUserRequestIndicator(), {
  [TOGGLE_REQUEST_INDICATOR_VISIBILITY]: persistRequestIndicatorVisibility,
  [ADD_REQUEST_INDICATOR]: addRequestEndpoint,
  [REMOVE_REQUEST_INDICATOR]: removeRequestEndpoint
});

export default requestIndicator;
