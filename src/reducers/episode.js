import { EPISODE_LOAD, EPISODE_REMOVE } from '../constants/actions'
import { createReducer, loadEntityList, removeEntityById } from './utils'

const episode = createReducer({ byId: {}, allIds: [] }, {
    [EPISODE_LOAD]   : loadEntityList,
    [EPISODE_REMOVE] : removeEntityById
});

export default episode
