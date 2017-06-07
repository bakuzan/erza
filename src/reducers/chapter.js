import { CHAPTER_LOAD } from '../constants/actions'
import { createReducer, loadEntityList } from './utils'

const chapter = createReducer({ byId: {}, allIds: [] }, {
    [CHAPTER_LOAD]   : loadEntityList
});

export default chapter
