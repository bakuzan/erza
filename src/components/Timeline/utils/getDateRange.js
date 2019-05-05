import { getFirstDateOfMonth, getLastDateOfMonth } from 'utils';

import formatDateInput from './formatDateInput';

function reduceDateBy(date, mod) {
  const offset = mod || 0;
  const d = new Date(date);
  d.setMonth(d.getMonth() - offset);
  return d;
}

export default function getDateRange(toDate, parts) {
  const fromDate = reduceDateBy(toDate, parts);

  return [
    formatDateInput(getFirstDateOfMonth(fromDate)),
    formatDateInput(getLastDateOfMonth(toDate))
  ]; // fromDate, toDate
}
