import { Strings } from '../../constants/values';
import {
  pagedDataWrapper,
  constructFilterString,
  historyKeyFieldsWithSeries
} from '../common';

const chapterFieldsWithSeries = historyKeyFieldsWithSeries(Strings.chapter);

const getChaptersForDateRange = (pageParameters, filters) => `
  {
    chapterConnection(${pageParameters}${constructFilterString(filters)}) {
      ${pagedDataWrapper(chapterFieldsWithSeries)}
    }
  }
`;

const ChapterQl = {
  getChaptersForDateRange
};

export default ChapterQl;
