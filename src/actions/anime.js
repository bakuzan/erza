import update from 'immutability-helper';
import AnimeQL from '../graphql/query/anime';
import AnimeML from '../graphql/mutation/anime';
import { loadItems, loadItemsById, mutateItem } from './listItems';
import { createEpisode } from './episode';
import { UPDATE_ANIME } from '../constants/actions';
import { Strings } from '../constants/values';
import updatePrePost from '../utils/validators/animePost';
import { mapEpisodeData } from '../utils/data';

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
    const anime = getState().entities.anime.byId[editItem._id];
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
