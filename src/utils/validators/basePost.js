import fetchFromServer from 'graphql/fetch';
import { Paths } from 'constants/paths';
import { Enums, Strings } from 'constants/values';
import { coalesceSeriesImage } from '../index';
import { getUniquePropertiesForItemType, intergrateMalEntry } from '../data';

const searchMyAnimeList = (type) => (search) =>
  fetchFromServer(Paths.build(Paths.malSearch, { type, search }));
export const searchAnime = searchMyAnimeList(Strings.anime);
export const searchManga = searchMyAnimeList(Strings.manga);

export const malResponseGenerator = (type, postItem) => (response) => {
  if (!Array.isArray(response)) return {};
  const item = response.find((x) => x.id === postItem.malId);

  if (!item) return {};
  return intergrateMalEntry(type)({}, item);
};

export const applyUpdates = (type) => (entity, malItem) => {
  const { current, total } = getUniquePropertiesForItemType(type);
  const updates = {};
  const item = Object.assign({}, entity, malItem, {
    image: coalesceSeriesImage(entity, malItem)
  });

  // END
  if (item[current] === item[total] && item[total] !== 0) {
    if (item.end === undefined || item.end === null) {
      updates.end = new Date().toISOString();
    }
  } else if (item.isRepeat === false) {
    //in the event the 'complete-ness' of an entry needs to be undone.
    //this will undo the end date.
    updates.end = null;
  }

  // STATUS
  if (!!item.end || !!updates.end) {
    updates.status = Enums.status.completed;
  }

  // IS REPEAT
  if (item.isRepeat && item[current] === item[total]) {
    updates.timesCompleted = item.timesCompleted + 1;
    updates.isRepeat = false;
  }

  return Object.assign({}, item, updates);
};
