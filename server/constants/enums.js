function mapEnumArrayToObject(arr) {
  return arr.reduce((p, k) => ({ ...p, [k]: k }), {});
}

const Statuses = ['Ongoing', 'Completed', 'Onhold', 'Dropped', 'Planned'];

const AnimeTypes = ['Unknown', 'TV', 'OVA', 'Movie', 'Special', 'ONA', 'Music'];
const AnimeType = mapEnumArrayToObject(AnimeTypes);
const SeasonTypes = [AnimeType.TV, AnimeType.ONA];

const MangaTypes = [
  'Unknown',
  'Manga',
  'Novel',
  'Oneshot',
  'Doujinshi',
  'Manhwa',
  'Manhua'
];

const StatTypes = ['Anime', 'Manga'];
const StatBreakdowns = ['Month', 'Season'];

module.exports = {
  // Item
  Statuses,
  Status: mapEnumArrayToObject(Statuses),
  AnimeTypes,
  AnimeType,
  SeasonTypes,
  SeasonType: mapEnumArrayToObject(SeasonTypes),
  MangaTypes,
  MangaType: mapEnumArrayToObject(MangaTypes),
  // Stat
  StatTypes,
  StatType: mapEnumArrayToObject(StatTypes),
  StatBreakdowns,
  StatBreakdown: mapEnumArrayToObject(StatBreakdowns)
};
