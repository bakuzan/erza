// Common

function mapToSeries(obj, extra) {
  const { rating } = obj;
  const ifRating = rating ? { rating } : {};
  return { ...obj, ...ifRating, ...extra };
}

function mapToHistory(obj, numValues) {
  const { number, note, rating } = obj;
  const d = Date.now() + number;
  return {
    date: new Date(d).toISOString(),
    note: note || '',
    rating: rating || 0,
    ...numValues
  };
}

// Anime/Episode

function mapFromAnime({ episode, ...obj }) {
  return { ...obj, current: episode };
}

function mapToAnime({ current, ...obj }) {
  return mapToSeries(obj, { episode: current });
}

function mapToEpisode({ seriesId, ...obj }) {
  return mapToHistory(obj, { animeId: seriesId, episode: obj.number });
}

// Manga/Chapter

function mapFromManga({ chapter, ...obj }) {
  return { ...obj, current: chapter };
}

function mapToManga({ current, ...obj }) {
  const ifVolume = volume ? { volume } : {};
  return mapToSeries(obj, { chapter: current, ...ifVolume });
}

function mapToChapter({ seriesId, number, ...obj }) {
  return mapToHistory(obj, { mangaId: seriesId, chapter: obj.number });
}

module.exports = {
  mapAnimeAndEpisode: {
    mapToSeries: mapToAnime,
    mapFromSeries: mapFromAnime,
    mapHistory: mapToEpisode
  },
  mapMangaAndChapter: {
    mapToSeries: mapToManga,
    mapFromSeries: mapFromManga,
    mapHistory: mapToChapter
  }
};
