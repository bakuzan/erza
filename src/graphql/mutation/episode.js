import {Strings} from '../../constants/values'
import {historyKeyFieldsWithSeries} from '../common'

const createEpisode = episode => (`
  mutation {
    episodeCreate(record: ${episode}) {
      record: record {
        ${historyKeyFieldsWithSeries(Strings.episode)}
      }
    }
  }
`)

const updateEpisodeById = episode => (`
  mutation {
    episodeUpdateById(record: ${episode}) {
      record: record {
        ${historyKeyFieldsWithSeries(Strings.episode)}
      }
    }
  }
`)

const removeEpisode = id => (`
  mutation {
    episodeRemoveById(_id: "${id}") {
      record {
        episode
        series {
          title
        }
      }
    }
  }
`)

const EpisodeML = {
  createEpisode,
  updateEpisodeById,
  removeEpisode
}

export default EpisodeML
