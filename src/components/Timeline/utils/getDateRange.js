import { getLastDateOfMonth } from 'utils';

import { BASE_BUTTON_SIZE } from './consts';
import formatDateInput from './formatDateInput';

function reduceDateBy(date, mod) {
  const d = new Date(date);
  d.setMonth(d.getMonth() - mod);
  return d;
}

export default function getDateRange(toDate, width) {
  if (!width) {
    return [];
  }

  const dateButtonSpace = width - 2 * BASE_BUTTON_SIZE;
  const parts = Math.floor(dateButtonSpace / BASE_BUTTON_SIZE) - 1;
  const fromDate = reduceDateBy(toDate, parts);

  return [
    formatDateInput(fromDate),
    formatDateInput(getLastDateOfMonth(toDate))
  ]; // fromDate, toDate
}
