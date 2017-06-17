import { CHAPTER_LOAD, CHAPTER_REFRESH, CHAPTER_REMOVE } from '../constants/actions'
import { createReducer, loadEntityList, addEntity, removeEntityById } from './utils'

const chapter = createReducer({ byId: {}, allIds: [] }, {
    [CHAPTER_LOAD]   : loadEntityList,
    [CHAPTER_REFRESH]: addEntity,
    [CHAPTER_REMOVE] : removeEntityById
});

export default chapter
