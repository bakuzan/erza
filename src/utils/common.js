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

export const getTimeoutSeconds = s => 1000 * s;
export const getTimeoutMinutes = m => getTimeoutSeconds(60) * m;

const timers = {};
export const debounce = (f, t) => {
  clearTimeout(timers[f]);
  timers[f] = setTimeout(() => f(), t);
}
