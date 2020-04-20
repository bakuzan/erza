import {
  MANGA_ADD,
  MANGA_UPDATE,
  MANGA_REMOVE,
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
    [MANGA_ADD]: addEntity,
    [MANGA_UPDATE]: updateById,
    [MANGA_REMOVE]: removeEntityById,
    [MANGA_LOAD]: loadEntityList
  }
);

export default manga;
