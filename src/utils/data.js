import EpisodeModel from '../models/episode-model'
import {Enums} from '../constants/values'

export const mapEpisodeData = (anime, { _id, episode, ratings, notes }) => {
  return Array(episode - anime.episode)
    .fill(null)
    .map((item, index) => {
      const episodeNumber = anime.episode + 1 + index;
      return new EpisodeModel({
        parent: _id,
        rating: ratings[episodeNumber] || 0,
        note: notes[episodeNumber] || '',
        episode: episodeNumber,
        isAdult: anime.isAdult
      });
    });
};

export const mapStateToEntityList = state => state.allIds.map(id => state.byId[id]);
export const mapUrlFilterToEntityObject = ({ filter }) => ({
  name: filter,
  value: Enums.status[filter]
})
