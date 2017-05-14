import { pagedDataWrapper, constructFilterString } from './common'

const episodeFields = `
  _id
  date
  episode
  rating
  note
`;

const episodeFieldsWithSeries = `
  ${episodeFields}
  series {
    _id
    title
  }
`;

const getEpisodesForDateRange = (pageParameters, filters) => (`
  {
    episodeConnection(${pageParameters}${constructFilterString(filters)}) {
      ${pagedDataWrapper(episodeFieldsWithSeries)}
    }
  }
`);

const getEpisodesForParents = parentId => (`
  {
    episodeMany(filter: { parent: ${parentId} }) {
      ${episodeFields}
    }
  }
`)

const EpisodeQl = {
  getEpisodesForDateRange,
  getEpisodesForParents
};

export default EpisodeQl
