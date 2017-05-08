import {Paths} from '../constants/paths'
import fetchFromServer from '../graphql/fetch'
import {constructRecordForPost} from '../graphql/query/common'
import {EPISODE_REQUEST, EPISODE_SUCCESS} from '../constants/actions'
import EpisodeML from '../graphql/mutation/episode'

const startingEpisodeRequest = () => ({
  type: EPISODE_REQUEST,
  isFetching: true
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
