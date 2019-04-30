import {
  dateStringToISOString,
  preventDatesPre1970,
  coalesceSeriesImage,
  capitalise
} from 'utils';
import AnimeModel from '../models/animeModel';
import MangaModel from '../models/mangaModel';
import { Enums, Strings, Properties } from '../constants/values';

export function selectPageItems(items, type, paging) {
  const { size, page } = paging;
  const startIndex = page * size;
  const endIndex = startIndex + size;
  return items.slice(startIndex, endIndex);
}

export const mapStateToEntity = (state, id) => state.byId[id] || {};

export const mapStateToEntityList = (state) =>
  state.allIds.map((id) => state.byId[id]);

export const mapUrlFilterToEntityObject = ({ filter }) => ({
  name: filter,
  value: Enums.status[capitalise(filter)]
});

export const getUniquePropertiesForItemType = (t) =>
  t === Strings.anime
    ? { current: Properties.episode, total: Properties.seriesEpisodes }
    : { current: Properties.chapter, total: Properties.seriesChapters };

export const getHistoryNameForItemType = (t) =>
  t === Strings.anime ? Properties.episode : Properties.chapter;

export const itemModelForType = (t) => (obj) =>
  t === Strings.anime ? new AnimeModel(obj) : new MangaModel(obj);

const intergrateMalEntryOptionalFields = (t, { volumes }) =>
  t === Strings.manga ? { series_volumes: volumes || null } : {};

export const intergrateMalEntry = (type) => (model, malItem) => {
  if (!malItem) {
    return Object.assign({}, model, { malId: null });
  }

  const optionalFields = intergrateMalEntryOptionalFields(type, malItem);
  const { current, total } = getUniquePropertiesForItemType(type);
  return Object.assign(
    {},
    model,
    {
      title: !!model.id ? model.title : malItem.title,
      image: coalesceSeriesImage(model, malItem),
      malId: malItem.id || model.malId || null,
      series_type:
        Enums[type].type[malItem.type.replace(/\W/g, '').toLowerCase()],
      [total]: malItem[`${current}s`],
      series_start: preventDatesPre1970(malItem.start_date),
      series_end: preventDatesPre1970(malItem.end_date)
    },
    optionalFields
  );
};

export const shouldIntergrateMalEntry = (type) => (model, malItem) => {
  if (!model || !malItem) {
    return false;
  }

  const {
    image,
    malId,
    series_type,
    series_start,
    series_end,
    series_episodes,
    series_chapters,
    series_volumes
  } = model;

  return !(
    (image === malItem.image || image.includes(Strings.imgur)) &&
    malId === malItem.id &&
    series_type === Enums[type].type[malItem.type.toLowerCase()] &&
    series_chapters === malItem.chapters &&
    series_episodes === malItem.episodes &&
    series_volumes === malItem.volumes &&
    (series_start === dateStringToISOString(malItem.start_date) ||
      !preventDatesPre1970(malItem.start_date)) &&
    (series_end === dateStringToISOString(malItem.end_date) ||
      !preventDatesPre1970(malItem.end_date))
  );
};
