import EpisodeQL from '../graphql/query/episode';
import EpisodeML from '../graphql/mutation/episode';
import {
  mutateHistoryItem,
  removeHistoryItem,
  loadHistoryByDateRange
} from './list-items';
import { Strings } from '../constants/values';

export const createEpisode = item =>
  mutateHistoryItem(item, EpisodeML.createEpisode);

export const editEpisode = item =>
  mutateHistoryItem(item, EpisodeML.updateEpisodeById, Strings.episode);

export const deleteEpisode = id =>
  removeHistoryItem(Strings.episode, id, EpisodeML.removeEpisode);

export const loadEpisodesByDateRange = (filters = {}, pageChange = null) =>
  loadHistoryByDateRange(
    {
      pageChange,
      filters,
      type: Strings.episode
    },
    EpisodeQL.getEpisodesForDateRange
  );
