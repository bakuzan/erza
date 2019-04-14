import update from 'immutability-helper';
import { Strings } from 'constants/values';

export { capitalise } from 'ayaka/capitalise';
export { default as parseIfInt } from 'ayaka/parseIfInt';
export { default as castStringToBool } from 'ayaka/castStringToBool';
export { default as getEventValue } from 'ayaka/getEventValue';
export { default as padNumber } from 'ayaka/padNumber';
export { default as getKeyByValue } from 'ayaka/getKeyByValue';
export {
  default as getSingleObjectProperty
} from 'ayaka/getSingleObjectProperty';
export { getTimeoutSeconds, getTimeoutMinutes } from 'ayaka/getTimeout';
export { default as debounce } from 'ayaka/debounce';
export { default as updateSameAsObject } from 'ayaka/updateSameAsObject';
export { default as isObject } from 'ayaka/isObject';
export { default as isArray } from 'ayaka/isArray';
export { default as isString } from 'ayaka/isString';
export { default as isNumber } from 'ayaka/isNumber';
export { default as convertToBase64 } from 'ayaka/convertToBase64';
export { default as createListeners } from 'ayaka/createListeners';
export { default as objectsAreEqual } from 'ayaka/objectsAreEqual';
export { default as generateUniqueId } from 'ayaka/generateUniqueId';
export { default as compose } from 'ayaka/compose';
export { default as curry } from 'ayaka/curry';
export {
  default as constructObjectFromSearchParams
} from 'ayaka/constructObjectFromSearchParams';
export { default as getElementCoordinates } from 'ayaka/getElementCoordinates';
export { default as dateAsMs } from 'ayaka/dateAsMs';
export { default as endOfDay } from 'ayaka/endOfDay';
export { default as startOfDay } from 'ayaka/startOfDay';
export { default as getDayName } from 'ayaka/getDayName';
export { default as formatDateForInput } from 'ayaka/formatDateForInput';
export { default as formatDateForDisplay } from 'ayaka/formatDateForDisplay';
export { default as formatDateISO } from 'ayaka/formatDateISO';
export {
  default as formatDateTimeForDisplay
} from 'ayaka/formatDateTimeForDisplay';

// export {
//   capitalise,
//   parseIfInt,
//   castStringToBool,
//   getEventValue,
//   padNumber,
//   getKeyByValue,
//   getSingleObjectProperty,
//   getTimeoutSeconds,
//   getTimeoutMinutes,
//   debounce,
//   updateSameAsObject,
//   isObject,
//   isArray,
//   isString,
//   isNumber,
//   convertToBase64,
//   createListeners,
//   objectsAreEqual,
//   generateUniqueId,
//   compose,
//   curry,
//   constructObjectFromSearchParams,
//   getElementCoordinates,
//   dateAsMs,
//   endOfDay,
//   startOfDay,
//   getDayName,
//   formatDateForDisplay,
//   formatDateForInput,
//   formatDateISO,
//   formatDateTimeForDisplay
// };

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
