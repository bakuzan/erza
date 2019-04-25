function mapEnumArrayToObject(arr) {
  return arr.reduce((p, k) => ({ ...p, [k]: k }), {});
}

const Statuses = Object.freeze([
  'Ongoing',
  'Completed',
  'Onhold',
  'Dropped',
  'Planned'
]);

const AnimeTypes = Object.freeze([
  'Unknown',
  'TV',
  'OVA',
  'Movie',
  'Special',
  'ONA',
  'Music'
]);
const AnimeType = Object.freeze(mapEnumArrayToObject(AnimeTypes));
const SeasonTypes = Object.freeze([AnimeType.TV, AnimeType.ONA]);

const MangaTypes = Object.freeze([
  'Unknown',
  'Manga',
  'Novel',
  'Oneshot',
  'Doujinshi',
  'Manhwa',
  'Manhua'
]);

const StatTypes = Object.freeze(['Anime', 'Manga']);
const StatBreakdowns = Object.freeze(['Month', 'Season']);

module.exports = {
  // Item
  Statuses,
  Status: Object.freeze(mapEnumArrayToObject(Statuses)),
  AnimeTypes,
  AnimeType,
  SeasonTypes,
  SeasonType: Object.freeze(mapEnumArrayToObject(SeasonTypes)),
  MangaTypes,
  MangaType: Object.freeze(mapEnumArrayToObject(MangaTypes)),
  // Stat
  StatTypes,
  StatType: Object.freeze(mapEnumArrayToObject(StatTypes)),
  StatBreakdowns,
  StatBreakdown: Object.freeze(mapEnumArrayToObject(StatBreakdowns))
};
