import { ADD_TAG, TAGS_LOAD } from '../constants/actions'
import { createReducer, addEntity, loadEntityList } from './utils'

const tags = createReducer({ byId: {}, allIds: [] }, {
    [ADD_TAG]     : addEntity,
    [TAGS_LOAD]   : loadEntityList
});

export default tags
