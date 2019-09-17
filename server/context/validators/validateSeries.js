const { Status } = require('../../constants/enums');

const dateProps = ['start', 'end', 'series_start', 'series_end'];

function protectDates(item) {
  const obj = { ...item };

  dateProps.forEach((k) => {
    obj[k] = obj[k] || null;
  });

  return obj;
}

module.exports = function validateSeries(entity, { mapBefore, mapAfter }) {
  const updates = {};
  const item = protectDates(mapBefore(entity));

  // END
  if (item.current === item.total && item.total !== 0) {
    const noEndDate = item.end === undefined || item.end === null;

    if (noEndDate) {
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
  } else if (item.status === Status.Ongoing && !item.start) {
    updates.start = new Date().toISOString();
  }

  // IS REPEAT
  if (item.isRepeat && item.current === item.total) {
    updates.timesCompleted = item.timesCompleted + 1;
    updates.isRepeat = false;
  }

  return mapAfter({ ...item, ...updates });
};
