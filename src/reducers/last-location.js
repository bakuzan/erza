import { LAST_LOCATION_UPDATE } from '../constants/actions';
import { createReducer } from './utils';

const initialState = {
  location: null
};

const lastLocation = createReducer(initialState, {
  [LAST_LOCATION_UPDATE]: (state, action) => ({
    ...state,
    location: action.location
  })
});

export default lastLocation;
