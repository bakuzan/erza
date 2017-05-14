import {Paths} from '../constants/paths'
import fetchFromServer from '../graphql/fetch'
import {constructPagingAndSorting, constructRecordForPost} from '../graphql/query/common'
import {EPISODE_REQUEST, EPISODE_SUCCESS, EPISODE_LOAD} from '../constants/actions'
import {loadPageInfo} from './paging'
import EpisodeQL from '../graphql/query/episode'
import EpisodeML from '../graphql/mutation/episode'

const startingEpisodeRequest = () => ({
  type: EPISODE_REQUEST,
  isFetching: true
})

const loadEpisodeData = (data) => ({
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
    const { paging, sorting: { sortOrder }, isAdult } = getState();
    const pageSettings = constructPagingAndSorting(paging, { sortKey: 'date', sortOrder }, pageChange);
    const query = EpisodeQL.getEpisodesForDateRange(pageSettings, Object.assign({}, filters, { isAdult }) );
    fetchFromServer(`${Paths.graphql.base}${query}`)
      .then(response => {
        const data = response.data.episodeConnection;
        dispatch(loadEpisodeData(data.edges));
        dispatch(loadPageInfo({ pageInfo: data.pageInfo, count: data.count }));
      })
      .then(() => dispatch(finishEpisodeRequest()) );
  }
}

export const loadEpisodeForSeries = parent => {
  return function(dispatch) {
    dispatch(startingEpisodeRequest());
    fetchFromServer(`${Paths.graphql.base}${EpisodeQL.getEpisodesForParents(parent)}`)
      .then(response => dispatch(loadEpisodeData([{ node: response.data.episodeMany }])) )
      .then(() => dispatch(finishEpisodeRequest()) );
  }
}
