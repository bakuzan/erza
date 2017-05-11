import { pagedDataWrapper, constructFilterString } from './common'

const episodeFields = `
  _id
  parent
  date
  episode
  rating
  note
`;

const getEpisodesForDateRange = (pageParameters, filters) => (`
  {
    episodeConnection(${pageParameters}${constructFilterString(filters)}) {
      ${pagedDataWrapper(episodeFields)}
    }
  }
`);

const EpisodeQl = {
  getEpisodesForDateRange
};

export default EpisodeQl
