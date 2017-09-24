import { DAILY_ANIME_LOAD } from '../constants/actions'
import { createReducer, loadEntityList } from './utils'

const dailyAnime = createReducer({ byId: {}, allIds: [] }, {
    [DAILY_ANIME_LOAD]   : loadEntityList
});

export default dailyAnime
