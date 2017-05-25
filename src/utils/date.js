import {Strings} from '../constants/values'
import {padNumber} from './common'

const BAD_MAL_DATE = '0000-00-00';

const formatTime = date => `${padNumber(new Date(date).getHours(), 2)}:${padNumber(new Date(date).getMinutes(), 2)}`;
export const formatDateForDisplay = date => {
  const d = new Date(date);
  return `${padNumber(d.getDate(), 2)} ${Strings.monthNames[d.getMonth()]} ${d.getFullYear()} @ ${formatTime(d)}`;
}
export const formatDateForInput = d => {
  if (!d) return '';
  const date = new Date(d);
  return `${date.getFullYear()}-${padNumber(date.getMonth()+1, 2)}-${padNumber(date.getDate(), 2)}`;
}
export const formatDateISO = d => `${formatDateForInput(d)}T${formatTime(d)}`;
export const dateAsMs = d => new Date(d).getTime();

const setTimeForDate = (h, m, s) => date => {
  const d = new Date(date);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), h, m, s);
}
export const startOfDay = setTimeForDate(0, 0, 0)
export const endOfDay = setTimeForDate(23, 59, 59)

export const dateStringToISOString = s => !!s && s !== BAD_MAL_DATE ? new Date(s).toISOString() : null;
