import {
  ADD_MANGA,
  UPDATE_MANGA,
  REMOVE_MANGA,
  MANGA_LOAD
} from '../constants/actions';
import {
  createReducer,
  addEntity,
  updateById,
  removeEntityById,
  loadEntityList
} from './utils';

const manga = createReducer(
  { byId: {}, allIds: [] },
  {
    [ADD_MANGA]: addEntity,
    [UPDATE_MANGA]: updateById,
    [REMOVE_MANGA]: removeEntityById,
    [MANGA_LOAD]: loadEntityList
  }
);

export default manga;
