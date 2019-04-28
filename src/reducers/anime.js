import {
  ADD_ANIME,
  UPDATE_ANIME,
  REMOVE_ANIME,
  ANIME_LOAD
} from '../constants/actions';
import {
  createReducer,
  addEntity,
  updateById,
  removeEntityById,
  loadEntityList
} from './utils';

const anime = createReducer(
  { byId: {}, allIds: [] },
  {
    [ADD_ANIME]: addEntity,
    [UPDATE_ANIME]: updateById,
    [REMOVE_ANIME]: removeEntityById,
    [ANIME_LOAD]: loadEntityList
  }
);

export default anime;
