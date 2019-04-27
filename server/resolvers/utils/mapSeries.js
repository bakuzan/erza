const mapAnime = {
  mapBefore: (o) => ({
    ...o,
    current: o.episode,
    total: o.series_episodes
  }),
  mapAfter: (o) => ({ ...o, episode: o.current, series_episodes: o.total })
};

const mapManga = {
  mapBefore: (o) => ({
    ...o,
    current: o.chapter,
    total: o.series_chapters
  }),
  mapAfter: (o) => ({ ...o, chapter: o.current, series_chapters: o.total })
};

module.exports = { mapAnime, mapManga };
