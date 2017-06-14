import EpisodeQL from '../graphql/query/episode'
import EpisodeML from '../graphql/mutation/episode'
import {loadHistoryForSeries, mutateHistoryItem, loadHistoryByDateRange} from './list-items'
import {Strings} from '../constants/values'


export const createEpisode = (item) => mutateHistoryItem(
  item,
  EpisodeML.createEpisode
)

export const loadEpisodesByDateRange = (filters = {}, pageChange = null) => loadHistoryByDateRange({
    pageChange,
    filters,
    type: Strings.episode
  },
  EpisodeQL.getEpisodesForDateRange
)

export const loadEpisodeForSeries = parent => loadHistoryForSeries(
  Strings.episode,
  EpisodeQL.getEpisodesForParent(parent)
)
