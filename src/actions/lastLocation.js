import { LAST_LOCATION_UPDATE } from '../constants/actions';

export const updateLastLocation = location => ({
  type: LAST_LOCATION_UPDATE,
  location
});
