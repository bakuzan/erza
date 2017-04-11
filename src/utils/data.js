import EpisodeModel from '../models/episode-model'

export const mapEpisodeData = (start = 0, { id, episode, ratings, notes }) => {
  return Array(episode - start).fill(null).map((item, index) => {
    const episodeNumber = start + 1 + index;
    return new EpisodeModel({
      parent: id,
      rating: ratings[episodeNumber] || 0,
      note: notes[episodeNumber] || '',
      episode: episodeNumber
    });
  });
};
