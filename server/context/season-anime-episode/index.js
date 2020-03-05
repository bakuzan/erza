const inSeasonCalc = require('../../utils/inSeason');

module.exports = {
  mapToSeries(data) {
    const {
      animeId,
      title,
      overallRating: rating,
      totalEpisodes,
      image,
      malId
    } = data;

    return {
      id: animeId,
      title,
      image,
      malId,
      rating,
      totalEpisodes,
      season: inSeasonCalc(data)
    };
  },
  mapToEpisode(data) {
    const { id, date, rating, episode, animeId } = data;
    return { id, date, rating, episode, animeId };
  }
};
