import { ADD_TAG, TAG_LOAD } from '../constants/actions'
import { createReducer, addEntity, loadEntityList } from './utils'

const tags = createReducer({ byId: {}, allIds: [] }, {
    [ADD_TAG]    : addEntity,
    [TAG_LOAD]   : loadEntityList
});

export default tags
