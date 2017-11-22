import {Strings} from '../constants/values'
import {padNumber} from './common'


const formatTime = date => date ? `${padNumber(new Date(date).getHours(), 2)}:${padNumber(new Date(date).getMinutes(), 2)}` : '';
export const formatDateForDisplay = date => {
  if (!date) return '';
  const d = new Date(date);
  return `${padNumber(d.getDate(), 2)} ${Strings.monthNames[d.getMonth()]} ${d.getFullYear()}`;
}

export const formatDateTimeForDisplay = date => `${formatDateForDisplay(date)} @ ${formatTime(date)}`;

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


const BAD_BLANK_MAL_DATE = '0000-00-00';
const BAD_MAL_DATE_PART = '-00';

const isNotBadMalDate = s => s !== BAD_BLANK_MAL_DATE && s.indexOf(BAD_MAL_DATE_PART) === -1;
export const dateStringToISOString = s => !!s && isNotBadMalDate(s) ? new Date(s).toISOString() : null;
export const preventDatesPre1970 = d => !!dateStringToISOString(d) && new Date(d) >= new Date("1970-01-01") ? dateStringToISOString(d) : null

const getWeekExtreme = check => date => {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + check(day)
  d.setDate(diff)
  return d
}

export const weekBeginning = getWeekExtreme((d) => d === 0 ? -6:1)
export const weekEnding = getWeekExtreme((d) => d === 0 ? 0:7)


const MS_DAY = 60*60*24*1000
export const daysDifferentBetweenDates = (d1, d2) => {
  const a = new Date(d1)
  const b = new Date(d2)

  return (Math.floor(b - a) / MS_DAY)
}
