import {historyKeyFields} from '../common'

const createEpisode = episode => (`
  mutation {
    episodeCreate(record: ${episode}) {
      record: record {
        ${historyKeyFields('episode')}
      }
    }
  }
`)

const EpisodeML = {
  createEpisode
}

export default EpisodeML
