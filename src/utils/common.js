import update from 'immutability-helper';
import { Strings } from 'constants/values';
import { Utils } from 'meiko';

export const {
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
  getElementCoordinates
} = Utils;

export const getUserSettings = () =>
  Utils.getObjectFromLocalStorageByProperty(Strings.localUserSettings);

export const persistUserSettings = Utils.persistObjectToLocalStorage(
  Strings.localUserSettings
);

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
