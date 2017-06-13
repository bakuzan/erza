import update from 'immutability-helper'
import { ANIME_LOAD } from '../constants/actions'
import AnimeQL from '../graphql/query/anime'
import AnimeML from '../graphql/mutation/anime'
import {
  loadItems,
  loadItemsById,
  mutateItem
} from './list-items'
import {createEpisode} from './episode'
import {Strings} from '../constants/values'
import updatePrePost from '../utils/validators/anime-post'
import {mapEpisodeData} from '../utils/data'

console.log('ANIME LOAD => ', loadAnimeData);

export const loadAnimeData = (data) => ({
  type: ANIME_LOAD,
  data
})

export const createAnime = (item) => mutateItem(
  Strings.anime,
  item,
  AnimeML.createAnime
)

export const editAnime = (item) => mutateItem(
  Strings.anime,
  item,
  AnimeML.updateAnimeById
)

export const addEpisodes = updateValues => {
  return function(dispatch, getState) {
    const anime = getState().entities.anime.byId[updateValues._id];
    const history = mapEpisodeData(anime, updateValues);
    console.log('add episode => ', anime, updateValues, history)
    history.forEach(item => dispatch(createEpisode(item)) );
    return updatePrePost(
      update(anime, {
        episode: { $set: updateValues.episode }
      })
    )
    .then(editItem => {
      console.log('edit anime => ', editItem);
      dispatch(editAnime(editItem));
    });
  }
}

export const loadAnime = (filters = {}, pageChange = null) => loadItems({
    pageChange,
    filters,
    type: Strings.anime
  },
  AnimeQL.getFilteredList
)

export const loadAnimeById = (id, type = 'getById') => loadItemsById(
    Strings.anime,
    AnimeQL[type](id)
)
