import update from 'immutability-helper';
import { Strings } from 'constants/values';
import { capitalise } from 'ayaka/capitalise';
import parseIfInt from 'ayaka/parseIfInt';
import castStringToBool from 'ayaka/castStringToBool';
import getEventValue from 'ayaka/getEventValue';
import padNumber from 'ayaka/padNumber';
import getKeyByValue from 'ayaka/getKeyByValue';
import getSingleObjectProperty from 'ayaka/getSingleObjectProperty';
import { getTimeoutSeconds, getTimeoutMinutes } from 'ayaka/getTimeout';
import debounce from 'ayaka/debounce';
import updateSameAsObject from 'ayaka/updateSameAsObject';
import isObject from 'ayaka/isObject';
import isArray from 'ayaka/isArray';
import isString from 'ayaka/isString';
import isNumber from 'ayaka/isNumber';
import convertToBase64 from 'ayaka/convertToBase64';
import createListeners from 'ayaka/createListeners';
import objectsAreEqual from 'ayaka/objectsAreEqual';
import generateUniqueId from 'ayaka/generateUniqueId';
import compose from 'ayaka/compose';
import curry from 'ayaka/curry';
import constructObjectFromSearchParams from 'ayaka/constructObjectFromSearchParams';
import getElementCoordinates from 'ayaka/getElementCoordinates';
import Store from 'ayaka/localStorage';
import dateAsMs from 'ayaka/dateAsMs';
import endOfDay from 'ayaka/endOfDay';
import startOfDay from 'ayaka/startOfDay';
import getDayName from 'ayaka/getDayName';
import formatDateForInput from 'ayaka/formatDateForInput';
import formatDateForDisplay from 'ayaka/formatDateForDisplay';
import formatDateISO from 'ayaka/formatDateISO';
import formatDateTimeForDisplay from 'ayaka/formatDateTimeForDisplay';

export {
  capitalise,
  parseIfInt,
  castStringToBool,
  getEventValue,
  padNumber,
  getKeyByValue,
  getSingleObjectProperty,
  getTimeoutSeconds,
  getTimeoutMinutes,
  debounce,
  updateSameAsObject,
  isObject,
  isArray,
  isString,
  isNumber,
  convertToBase64,
  createListeners,
  objectsAreEqual,
  generateUniqueId,
  compose,
  curry,
  constructObjectFromSearchParams,
  getElementCoordinates,
  dateAsMs,
  endOfDay,
  startOfDay,
  getDayName,
  formatDateForDisplay,
  formatDateForInput,
  formatDateISO,
  formatDateTimeForDisplay
};

const BAD_BLANK_MAL_DATE = '0000-00-00';
const BAD_MAL_DATE_PART = '-00';

const isNotBadMalDate = (s) =>
  s !== BAD_BLANK_MAL_DATE && s.indexOf(BAD_MAL_DATE_PART) === -1;

export const dateStringToISOString = (s) =>
  !!s && isNotBadMalDate(s) ? new Date(s).toISOString() : null;

export const preventDatesPre1970 = (d) =>
  !!dateStringToISOString(d) && new Date(d) >= new Date('1970-01-01')
    ? dateStringToISOString(d)
    : null;

const storage = new Store(Strings.localUserSettings, {});
export const getUserSettings = () => storage.get();
export const persistUserSettings = (values) => storage.set(values);

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
};

export const coalesceSeriesImage = (model, malItem) => {
  return (model.image && model.image.includes(Strings.imgur)) ||
    (model.image && !malItem.image)
    ? model.image
    : malItem.image || '';
};
