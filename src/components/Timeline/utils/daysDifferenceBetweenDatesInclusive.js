import { daysDifferenceBetweenDates } from 'utils';

export default function daysDifferenceBetweenDatesInclusive(s, e, inc = true) {
  const diff = daysDifferenceBetweenDates(s, e);
  return inc ? Math.floor(diff >= 0 ? diff + 1 : diff - 1) : diff;
}
