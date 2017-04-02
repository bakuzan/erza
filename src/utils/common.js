import {Strings} from '../constants/values'

export const capitalise = (str) => str.charAt(0).toUpperCase() + str.slice(1);
export const parseIfInt = (val) => parseInt(val, 10) || val;
export const getEventValue = ({ type, checked, value }) =>
  type === Strings.checkbox                      ? checked :
  type === Strings.date || type === Strings.text ? value   :
                                                   parseIfInt(value);
export const padNumber = (n, width, z) => {
   z = z || '0';
   n += '';
   return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

const formatTime = date => `${padNumber(date.getHours(), 2)}:${padNumber(date.getMinutes(), 2)}`;
export const formatDateForDisplay = (date) => {
  const d = new Date(date);
  return `${padNumber(d.getDate(), 2)} ${Strings.monthNames[d.getMonth()]} ${d.getFullYear()} @ ${formatTime(d)}`;
}
