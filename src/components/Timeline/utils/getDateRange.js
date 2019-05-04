import { getFirstDateOfMonth, getLastDateOfMonth } from 'utils';

import formatDateInput from './formatDateInput';

function reduceDateBy(date, mod) {
  const d = new Date(date);
  d.setMonth(d.getMonth() - mod);
  return d;
}

export default function getDateRange(toDate, parts) {
  if (!parts) {
    return [];
  }

  const fromDate = reduceDateBy(toDate, parts);

  return [
    formatDateInput(getFirstDateOfMonth(fromDate)),
    formatDateInput(getLastDateOfMonth(toDate))
  ]; // fromDate, toDate
}
