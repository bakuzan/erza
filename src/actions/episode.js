import EpisodeML from '../graphql/mutation/episode';
import { getEpisodes } from 'erzaGQL/query';
import { episodeUpdate, episodeRemove } from 'erzaGQL/mutation';

import {
  mutateHistoryItem,
  removeHistoryItem,
  loadHistoryByDateRange
} from './utils/history';
import { Strings } from '../constants/values';

export const editEpisode = (item) =>
  mutateHistoryItem(episodeUpdate, item, Strings.episode);

export const deleteEpisode = (id) =>
  removeHistoryItem(episodeRemove, { id }, Strings.episode);

export const loadEpisodesByDateRange = (filters = {}, pageChange = null) =>
  loadHistoryByDateRange(getEpisodes, filters, {
    pageChange,
    type: Strings.episode
  });
