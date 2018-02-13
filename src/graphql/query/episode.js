import { Strings } from '../../constants/values';
import {
  pagedDataWrapper,
  constructFilterString,
  historyKeyFields,
  historyKeyFieldsWithSeries
} from '../common';

const episodeFields = historyKeyFields(Strings.episode);
const episodeFieldsWithSeries = historyKeyFieldsWithSeries(Strings.episode);

const getEpisodesForDateRange = (pageParameters, filters) => `
  {
    episodeConnection(${pageParameters}${constructFilterString(filters)}) {
      ${pagedDataWrapper(episodeFieldsWithSeries)}
    }
  }
`;

const getEpisodesForParent = parentId => `
  {
    episodeMany(sort: DATE_DESC, filter: { parent: "${parentId}" }) {
      ${episodeFields}
    }
  }
`;

const EpisodeQl = {
  getEpisodesForDateRange,
  getEpisodesForParent
};

export default EpisodeQl;
