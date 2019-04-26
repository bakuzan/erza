import update from 'immutability-helper';

import AnimeML from 'graphql/mutation/anime';
import {
  getAnimePaged,
  getAnimeById,
  getAnimeByIdForEdit
} from 'erzaGQL/query';

import { loadItems, loadItemsById, mutateItem } from './utils/series';

import { UPDATE_ANIME } from 'constants/actions';
import { Strings } from 'constants/values';
import updatePrePost from 'utils/validators/animePost';
import { mapEpisodeData } from 'utils/data';

export const createAnime = (item) =>
  mutateItem(Strings.anime, item, AnimeML.createAnime);

export const editAnime = (item) =>
  mutateItem(Strings.anime, item, AnimeML.updateAnimeById);

const updateAnimeInState = (item) => ({
  type: UPDATE_ANIME,
  item
});

export const addEpisodes = ({ editItem }) => {
  return function(dispatch, getState) {
    const anime = getState().entities.anime.byId[editItem.id];
    const updatedAnime = update(anime, {
      episode: { $set: editItem.episode },
      rating: { $set: editItem.overallRating || anime.rating }
    });
    dispatch(updateAnimeInState(updatedAnime));
    const history = mapEpisodeData(anime, editItem);
    history.forEach((item) => dispatch(createEpisode(item)));

    dispatch(editAnime(updatePrePost(updatedAnime)));
  };
};

export const loadAnime = (filters = {}, pageChange = null) =>
  loadItems(getAnimePaged, filters, {
    pageChange,
    type: Strings.anime
  });

export const loadAnimeById = (id) =>
  loadItemsById(getAnimeById, { id }, Strings.anime);

export const loadAnimeByIdForEdit = (id) =>
  loadItemsById(getAnimeByIdForEdit, { id }, Strings.anime);
