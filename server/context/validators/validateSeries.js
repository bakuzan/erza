const { Status } = require('../constants/enums');

module.exports = function validateSeries(entity, { mapBefore, mapAfter }) {
  const updates = {};
  const item = mapBefore(entity);

  // END
  if (item.current === item.total && item.total !== 0) {
    if (item.end === undefined || item.end === null) {
      updates.end = new Date().toISOString();
    }
  } else if (item.isRepeat === false) {
    //in the event the 'complete-ness' of an entry needs to be undone.
    //this will undo the end date.
    updates.end = null;
  }

  // STATUS
  if ((!!item.end && !updates.hasOwnProperty('end')) || !!updates.end) {
    updates.status = Status.Completed;
  } else if (item.status === Status.Completed) {
    updates.status = Status.Ongoing;
  }

  // IS REPEAT
  if (item.isRepeat && item.current === item.total) {
    updates.timesCompleted = item.timesCompleted + 1;
    updates.isRepeat = false;
  }

  return mapAfter({ ...item, ...updates });
};
