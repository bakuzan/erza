import { Strings } from '../../constants/values';
import {
  pagedDataWrapper,
  constructFilterString,
  historyKeyFieldsWithSeries
} from '../common';

const episodeFieldsWithSeries = historyKeyFieldsWithSeries(Strings.episode);

const getEpisodesForDateRange = (pageParameters, filters) => `
  {
    episodeConnection(${pageParameters}${constructFilterString(filters)}) {
      ${pagedDataWrapper(episodeFieldsWithSeries)}
    }
  }
`;

const EpisodeQl = {
  getEpisodesForDateRange
};

export default EpisodeQl;
