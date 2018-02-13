import { Strings } from '../../constants/values';
import {
  pagedDataWrapper,
  constructFilterString,
  historyKeyFields,
  historyKeyFieldsWithSeries
} from '../common';

const chapterFields = historyKeyFields(Strings.chapter);
const chapterFieldsWithSeries = historyKeyFieldsWithSeries(Strings.chapter);

const getChaptersForDateRange = (pageParameters, filters) => `
  {
    chapterConnection(${pageParameters}${constructFilterString(filters)}) {
      ${pagedDataWrapper(chapterFieldsWithSeries)}
    }
  }
`;

const getChaptersForParent = parentId => `
  {
    chapterMany(sort: DATE_DESC, filter: { parent: "${parentId}" }) {
      ${chapterFields}
    }
  }
`;

const ChapterQl = {
  getChaptersForDateRange,
  getChaptersForParent
};

export default ChapterQl;
