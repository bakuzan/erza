
const createEpisode = episode => (`
  mutation {
    episodeCreate(record: ${episode}) {
      record: record {
        parent
        date
        episode
        rating
        note
      }
    }
  }
`)

const EpisodeML = {
  createEpisode
}

export default EpisodeML
