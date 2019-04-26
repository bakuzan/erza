import { getChapters } from 'erzaGQL/query';
import { chapterUpdate, chapterRemove } from 'erzaGQL/mutation';

import {
  mutateHistoryItem,
  removeHistoryItem,
  loadHistoryByDateRange
} from './utils/history';
import { Strings } from '../constants/values';

export const editChapter = (item) =>
  mutateHistoryItem(chapterUpdate, item, Strings.chapter);

export const deleteChapter = (id) =>
  removeHistoryItem(chapterRemove, { id }, Strings.chapter);

export const loadChaptersByDateRange = (filters = {}, pageChange = null) =>
  loadHistoryByDateRange(getChapters, filters, {
    pageChange,
    type: Strings.chapter
  });
