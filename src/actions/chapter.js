import ChapterQL from '../graphql/query/chapter'
import ChapterML from '../graphql/mutation/chapter'
import {loadHistoryForSeries, mutateHistoryItem, removeHistoryItem, loadHistoryByDateRange} from './list-items'
import {Strings} from '../constants/values'


export const createChapter = item => mutateHistoryItem(
  item,
  ChapterML.createChapter
)

export const deleteChapter = id => removeHistoryItem(
  Strings.chapter,
  id,
  ChapterML.removeChapter
)

export const loadChaptersByDateRange = (filters = {}, pageChange = null) => loadHistoryByDateRange({
    pageChange,
    filters,
    type: Strings.chapter
  },
  ChapterQL.getChaptersForDateRange
)

export const loadChapterForSeries = parent => loadHistoryForSeries(
  Strings.chapter,
  ChapterQL.getChaptersForParent(parent)
)
