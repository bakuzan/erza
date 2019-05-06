import combinedStrings from './strings';
import combinedEnums from './enums';
export { Icons, Types } from 'mko';

export const Enums = combinedEnums;
export const Strings = combinedStrings;

export const Properties = {
  episode: 'episode',
  seriesEpisodes: 'series_episodes',
  isAdult: 'isAdult',
  isRepeat: 'isRepeat',
  status: 'status',
  season: 'season',
  tagList: 'tagList',
  chapter: 'chapter',
  seriesChapters: 'series_chapters',
  dayOfWeek: 'dayOfWeek',
  animeWithTag: 'animeWithTag',
  mangaWithTag: 'mangaWithTag',
  series: 'series'
};

export const NonPostableProperties = [
  Properties.season,
  Properties.tagList,
  Properties.dayOfWeek,
  Properties.animeWithTag,
  Properties.mangaWithTag,
  Properties.series
];

export const Days = combinedStrings.dayNames.map((s) => s.slice(0, 2));

export const pageSizes = {
  default: [5, 10, 15, 25],
  history: [10, 15, 25, 50]
};
