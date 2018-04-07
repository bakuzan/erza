import { FILTERS_TOGGLE_IS_OWNED_ONLY } from '../constants/actions';

export const toggleIsOwnedOnly = listType => ({
  type: FILTERS_TOGGLE_IS_OWNED_ONLY,
  listType
});
