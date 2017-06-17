import { EPISODE_LOAD, EPISODE_REFRESH, EPISODE_REMOVE } from '../constants/actions'
import { createReducer, loadEntityList, addEntity, removeEntityById } from './utils'

const episode = createReducer({ byId: {}, allIds: [] }, {
    [EPISODE_LOAD]   : loadEntityList,
    [EPISODE_REFRESH]: addEntity,
    [EPISODE_REMOVE] : removeEntityById
});

export default episode
