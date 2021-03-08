import { LOAD_REPEAT_HISTORY } from '../constants/actions';
import { Strings } from '../constants/values';
import { createReducer } from './utils';

function storeRepeatHistory(state, action) {
  const oldTypeState = state[action.statType];

  return {
    ...state,
    [action.statType]: {
      ...oldTypeState,
      [action.seriesId]: action.payload
    }
  };
}

const repeatHistory = createReducer(
  { [Strings.anime]: {}, [Strings.manga]: {} },
  {
    [LOAD_REPEAT_HISTORY]: storeRepeatHistory
  }
);

export default repeatHistory;
