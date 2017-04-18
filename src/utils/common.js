import update from 'immutability-helper'
import {Strings} from '../constants/values'

export const capitalise = (str) => str.charAt(0).toUpperCase() + str.slice(1);
export const parseIfInt = (val) => parseInt(val, 10) || val;
export const getEventValue = ({ type, checked, value }) =>
  type === Strings.checkbox                      ? checked :
  type === Strings.date || type === Strings.text ? value   :
                                                   parseIfInt(value);
export const padNumber = (n, width, z = 0) => {
   n += '';
   return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

const formatTime = date => `${padNumber(date.getHours(), 2)}:${padNumber(date.getMinutes(), 2)}`;
export const formatDateForDisplay = (date) => {
  const d = new Date(date);
  return `${padNumber(d.getDate(), 2)} ${Strings.monthNames[d.getMonth()]} ${d.getFullYear()} @ ${formatTime(d)}`;
}

export const getKeyByValue = (o, v) => Object.keys(o).find(k => o[k] === v);

const buildUpdateSkeleton = (o, s, v) => {
  s.split('.').forEach((k, i, a) => {
    let x = !(i === a.length - 1);
    o[k] = x ? {} : { $set: v };
    o = o[k];
  });
};

export const updateNestedProperty = (o, s, v) => {
  let obj = {};
  buildUpdateSkeleton(obj, s, v);
  return update(o, obj);
}

export const getUserSettings = () => JSON.parse(localStorage.getItem(Strings.localUserSettings)) || null;
export const persistUserSettings = (settingUpdate) => {
  const settings = getUserSettings();
  const updated = Object.assign({}, settings, settingUpdate);
  localStorage.setItem(Strings.localUserSettings, JSON.stringify(updated));
  return updated;
}
