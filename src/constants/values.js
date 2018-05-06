import { Constants } from 'meiko';
import combinedStrings from './strings';
import combinedEnums from './enums';

export const Enums = combinedEnums;
export const Strings = combinedStrings;
export const Icons = Constants.Icons;
export const Types = Constants.Types;

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
  mangaWithTag: 'mangaWithTag'
};

export const NonPostableProperties = [
  Properties.season,
  Properties.tagList,
  Properties.dayOfWeek,
  Properties.animeWithTag,
  Properties.mangaWithTag
];

export const Days = combinedStrings.dayNames.map(s => s.slice(0, 2));

export const pageSizes = {
  default: [5, 10, 15, 25],
  history: [25, 50, 75, 100]
};
