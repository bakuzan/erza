import { EPISODE_LOAD } from '../constants/actions'
import { createReducer, loadEntityList } from './utils'

const episode = createReducer({ byId: {}, allIds: [] }, {
    [EPISODE_LOAD]   : loadEntityList
});

export default episode
