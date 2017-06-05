import { ADD_MANGA, UPDATE_MANGA, MANGA_LOAD } from '../constants/actions'
import { createReducer, addEntity, updateById, loadEntityList } from './utils'

const manga = createReducer({ byId: {}, allIds: [] }, {
    [ADD_MANGA]    : addEntity,
    [UPDATE_MANGA] : updateById,
    [MANGA_LOAD]   : loadEntityList
});

export default manga
