import { ADD_ANIME, UPDATE_ANIME, ANIME_LOAD } from '../constants/actions';
import { createReducer, addEntity, updateById, loadEntityList } from './utils';

const anime = createReducer(
  { byId: {}, allIds: [] },
  {
    [ADD_ANIME]: addEntity,
    [UPDATE_ANIME]: updateById,
    [ANIME_LOAD]: loadEntityList
  }
);

export default anime;
