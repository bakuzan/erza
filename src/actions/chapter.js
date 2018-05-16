import ChapterQL from '../graphql/query/chapter';
import ChapterML from '../graphql/mutation/chapter';
import {
  mutateHistoryItem,
  removeHistoryItem,
  loadHistoryByDateRange
} from './list-items';
import { Strings } from '../constants/values';

export const createChapter = item =>
  mutateHistoryItem(item, ChapterML.createChapter);

export const editChapter = item =>
  mutateHistoryItem(item, ChapterML.updateChapterById, Strings.chapter);

export const deleteChapter = id =>
  removeHistoryItem(Strings.chapter, id, ChapterML.removeChapter);

export const loadChaptersByDateRange = (filters = {}, pageChange = null) =>
  loadHistoryByDateRange(
    {
      pageChange,
      filters,
      type: Strings.chapter
    },
    ChapterQL.getChaptersForDateRange
  );
