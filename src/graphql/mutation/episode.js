import {Strings} from '../../constants/values'
import {historyKeyFields} from '../common'

const createEpisode = episode => (`
  mutation {
    episodeCreate(record: ${episode}) {
      record: record {
        ${historyKeyFields(Strings.episode)}
      }
    }
  }
`)

const EpisodeML = {
  createEpisode
}

export default EpisodeML
