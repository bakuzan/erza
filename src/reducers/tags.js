import { ADD_TAG, REMOVE_TAG, TAGS_LOAD } from '../constants/actions'
import { createReducer, addEntity, removeEntityById, loadEntityList } from './utils'

const tags = createReducer({ byId: {}, allIds: [] }, {
    [ADD_TAG]     : addEntity,
    [REMOVE_TAG]  : removeEntityById,
    [TAGS_LOAD]   : loadEntityList
});

export default tags
