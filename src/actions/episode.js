import {Paths} from '../constants/paths'
import fetchFromServer from '../graphql/fetch'
import {constructPagingAndSorting, constructRecordForPost} from '../graphql/common'
import {EPISODE_REQUEST, EPISODE_SUCCESS, EPISODE_LOAD} from '../constants/actions'
import {loadPageInfo, resetPageToZero} from './paging'
import EpisodeQL from '../graphql/query/episode'
import EpisodeML from '../graphql/mutation/episode'
import {loadHistoryForSeries} from './list-items'
import {Strings} from '../constants/values'

const startingEpisodeRequest = () => ({
  type: EPISODE_REQUEST,
  isFetching: true
})

export const loadEpisodeData = (data) => ({
  type: EPISODE_LOAD,
  data
})

const finishEpisodeRequest = () => ({
  type: EPISODE_SUCCESS,
  isFetching: false
})

export const createEpisode = (item) => {
  return function(dispatch) {
    dispatch(startingEpisodeRequest());
    const newEpisode = constructRecordForPost(item);
    const mutation = EpisodeML.createEpisode(newEpisode);
    fetchFromServer(`${Paths.graphql.base}${mutation}`, 'POST')
      .then(response => {
        console.log(`%c Episode  created`, 'font-size: 20px; color: indigo')
        dispatch(finishEpisodeRequest());
      });
  }
}

export const loadEpisodesByDateRange = (filters = {}, pageChange = null) => {
  return function(dispatch, getState) {
    dispatch(startingEpisodeRequest());
    if (!pageChange) dispatch(resetPageToZero());
    const { paging, isAdult } = getState();
    const pageSettings = constructPagingAndSorting(paging, { sortKey: 'date', sortOrder: 'DESC' });
    const query = EpisodeQL.getEpisodesForDateRange(pageSettings, Object.assign({}, filters, { isAdult }) );
    fetchFromServer(`${Paths.graphql.base}${query}`)
      .then(response => {
        const data = response.data.episodeConnection;
        dispatch(loadEpisodeData(data.edges));
        dispatch(loadPageInfo({ count: data.count }));
      })
      .then(() => dispatch(finishEpisodeRequest()) );
  }
}

export const loadEpisodeForSeries = parent => loadHistoryForSeries(
  Strings.episode,
  EpisodeQL.getEpisodesForParents(parent)
)
