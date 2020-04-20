import {
  ANIME_ADD,
  ANIME_UPDATE,
  ANIME_REMOVE,
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
    [ANIME_ADD]: addEntity,
    [ANIME_UPDATE]: updateById,
    [ANIME_REMOVE]: removeEntityById,
    [ANIME_LOAD]: loadEntityList
  }
);

export default anime;
