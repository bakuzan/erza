import { TAG_ADD, TAG_REMOVE, TAGS_LOAD } from '../constants/actions';
import {
  createReducer,
  addEntity,
  removeEntityById,
  loadEntityList
} from './utils';

const tags = createReducer(
  { byId: {}, allIds: [] },
  {
    [TAG_ADD]: addEntity,
    [TAG_REMOVE]: removeEntityById,
    [TAGS_LOAD]: loadEntityList
  }
);

export default tags;
