// Common

function mapToSeries(obj, extra) {
  const { rating } = obj;
  const ifRating = rating ? { rating } : {};
  return { ...obj, ...ifRating, ...extra };
}

function mapToHistory(obj, numValues) {
  const { seriesId, note, rating } = obj;
  return {
    date: new Date().toISOString(),
    note: note || '',
    rating: rating || 0,
    animeId: seriesId,
    ...numValues
  };
}

// Anime/Episode

function mapFromAnime({ id, episode }) {
  return { id, current: episode };
}

function mapToAnime({ current, ...obj }) {
  return mapToSeries(obj, { episode: current });
}

function mapToEpisode({ seriesId, ...obj }) {
  return mapToHistory(obj, { animeId: seriesId });
}

// Manga/Chapter

function mapFromManga({ id, chapter }) {
  return { id, current: chapter };
}

function mapToManga({ current, ...obj }) {
  const ifVolume = volume ? { volume } : {};
  return mapToSeries(obj, { chapter: current, ...ifVolume });
}

function mapToChapter({ seriesId, ...obj }) {
  return mapToHistory(obj, { mangaId: seriesId });
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
