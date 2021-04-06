import { getEpisodes, getEpisodesForSeries } from 'erzaGQL/query';
import { episodeUpdate, episodeRemove } from 'erzaGQL/mutation';

import {
  mutateHistoryItem,
  removeHistoryItem,
  loadHistoryByDateRange,
  loadHistoryBySeries
} from './utils/history';
import { Strings } from '../constants/values';

export const editEpisode = (item) =>
  mutateHistoryItem(episodeUpdate, item, Strings.episode, getEpisodesForSeries);

export const deleteEpisode = (id) =>
  removeHistoryItem(episodeRemove, { id }, Strings.episode);

export const loadEpisodesByDateRange = (filters = {}, pageChange = null) =>
  loadHistoryByDateRange(getEpisodes, filters, {
    pageChange,
    type: Strings.episode
  });

export const loadEpisodesBySeries = (filters, pageChange = null) =>
  loadHistoryBySeries(getEpisodesForSeries, filters, {
    pageChange,
    type: Strings.episode
  });
