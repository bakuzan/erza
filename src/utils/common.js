import update from 'immutability-helper'
import {Strings, Types} from '../constants/values'

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
export const getSingleObjectProperty = o => !!o ? Object.keys(o)[0] : null;

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

export const updateSameAsObject = (o, u) => u && Object.keys(u).map(k => o[k] === u[k]).every(x => x === true);

const isTypeOf = t => v => typeof(v) === t;
export const isObject = isTypeOf(Types.object);
export const isString = isTypeOf(Types.string);
export const isNumber = isTypeOf(Types.number);
export const isArray = v => v instanceof Array

export const convertToBase64 = (file, callback) => {
  const reader = new FileReader()
  reader.onloadend = callback
  reader.readAsDataURL(file)
}

export const coalesceSeriesImage = (model, malItem) => {
  return model.image && model.image.includes(Strings.imgur)
    ? model.image 
    : (malItem.image || "");
}
