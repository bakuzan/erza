import { pagedDataWrapper, constructFilterString, historyKeyFields, historyKeyFieldsWithSeries } from '../common'

const chapterFields = historyKeyFields('chapter');
const chapterFieldsWithSeries = historyKeyFieldsWithSeries('chapter');


const getChaptersForDateRange = (pageParameters, filters) => (`
  {
    chapterConnection(${pageParameters}${constructFilterString(filters)}) {
      ${pagedDataWrapper(chapterFieldsWithSeries)}
    }
  }
`);

const getChaptersForParents = parentId => (`
  {
    chapterMany(sort: DATE_DESC, filter: { parent: "${parentId}" }) {
      ${chapterFields}
    }
  }
`)

const ChapterQl = {
  getChaptersForDateRange,
  getChaptersForParents
};

export default ChapterQl
