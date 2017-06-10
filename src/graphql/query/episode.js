import { pagedDataWrapper, constructFilterString, historyKeyFields, historyKeyFieldsWithSeries } from '../common'

const episodeFields = historyKeyFields('episode');
const episodeFieldsWithSeries = historyKeyFieldsWithSeries('episode');


const getEpisodesForDateRange = (pageParameters, filters) => (`
  {
    episodeConnection(${pageParameters}${constructFilterString(filters)}) {
      ${pagedDataWrapper(episodeFieldsWithSeries)}
    }
  }
`);

const getEpisodesForParent = parentId => (`
  {
    episodeMany(sort: DATE_DESC, filter: { parent: "${parentId}" }) {
      ${episodeFields}
    }
  }
`)

const EpisodeQl = {
  getEpisodesForDateRange,
  getEpisodesForParent
};

export default EpisodeQl
