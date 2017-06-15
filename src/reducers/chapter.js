import { CHAPTER_LOAD, CHAPTER_REMOVE } from '../constants/actions'
import { createReducer, loadEntityList, removeEntityById } from './utils'

const chapter = createReducer({ byId: {}, allIds: [] }, {
    [CHAPTER_LOAD]   : loadEntityList,
    [CHAPTER_REMOVE] : removeEntityById
});

export default chapter
