import {CHAPTER_LOAD} from '../constants/actions'
import ChapterQL from '../graphql/query/chapter'
// import ChapterML from '../graphql/mutation/chapter'
import {loadHistoryForSeries} from './list-items'
import {Strings} from '../constants/values'

export const loadChapterData = (data) => ({
  type: CHAPTER_LOAD,
  data
})

export const loadChapterForSeries = parent => loadHistoryForSeries(
  Strings.chapter,
  ChapterQL.getEpisodesForParents(parent)
)
