import update from 'immutability-helper';
import AnimeQL from '../graphql/query/anime';
import AnimeML from '../graphql/mutation/anime';
import { loadItems, loadItemsById, mutateItem } from './list-items';
import { createEpisode } from './episode';
import { Strings } from '../constants/values';
import updatePrePost from '../utils/validators/anime-post';
import { mapEpisodeData } from '../utils/data';

export const createAnime = item =>
  mutateItem(Strings.anime, item, AnimeML.createAnime);

export const editAnime = item =>
  mutateItem(Strings.anime, item, AnimeML.updateAnimeById);

export const addEpisodes = ({ editItem }) => {
  return function(dispatch, getState) {
    const anime = getState().entities.anime.byId[editItem._id];
    const history = mapEpisodeData(anime, editItem);
    history.forEach(item => dispatch(createEpisode(item)));
    return updatePrePost(
      update(anime, {
        episode: { $set: editItem.episode },
        rating: { $set: editItem.overallRating || anime.rating }
      })
    ).then(updatedItem => dispatch(editAnime(updatedItem)));
  };
};

export const loadAnime = (filters = {}, pageChange = null) =>
  loadItems(
    {
      pageChange,
      filters,
      type: Strings.anime
    },
    AnimeQL.getFilteredList
  );

export const loadAnimeById = (id, type = 'getById') =>
  loadItemsById(Strings.anime, AnimeQL[type](id));
