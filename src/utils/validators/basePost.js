import { Enums } from 'constants/values';
import { coalesceSeriesImage } from '../index';
import { getUniquePropertiesForItemType } from '../data';

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
