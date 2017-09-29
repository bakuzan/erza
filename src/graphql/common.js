import {NonPostableProperties} from '../constants/values'
import {isString, isArray} from '../utils/common'

const ampersand = "&";

export const constructPagingAndSorting = ({ itemsPerPage, page }, { sortKey, sortOrder }) => {
  const first = page * itemsPerPage + itemsPerPage;
  return `
    first: ${first},
    last: ${itemsPerPage},
    sort: ${sortKey.toUpperCase()}_${sortOrder},
  `;
}

const appendCharacter = t => (a, i) => (a.length === i + 1) ? ` ${t}` : ', ';
const appendArrayBreak = appendCharacter(']');
const appendKeyBreak = appendCharacter('}');

// eslint-disable-next-line
const processArray = v => v.length > 0 ? v.reduce((ac, cu, i) => `${ac} ${processType(cu)}${appendArrayBreak(v, i)}`, '[') : '[]';
const processType = v => ((v || v === "") && isString(v))
  ? `"${v.replace(ampersand, encodeURIComponent(ampersand))}"`
  : isArray(v)
      ? processArray(v)
      : v;

export const constructRecordForPost = (record) => {
  return Object.keys(record)
    .filter(x => !NonPostableProperties.some(y => y === x))
    .reduce((acc, curr, i, arr) => {
      const value = processType(record[curr]);
      return `${acc} ${curr}: ${value}${appendKeyBreak(arr, i)}`;
    }, '{');
}

export const constructFilterString = (filters) => {
  const properties = Object.keys(filters).reduce((acc, curr, i, arr) => {
    const value = processType(filters[curr]);
    const nextArg = value || value.toString() === "false" ? `${curr}: ${value}` : '';
    const separator = arr.length === i + 1 || !value ? '' : ', ';
    return `${acc}${nextArg}${separator}`;
  }, '');
  return `filter: { ${properties} }`;
}

export const pagedDataWrapper = (fields) => (`
  edges {
    node {
      ${fields}
    }
  }
  count
`);

export const itemKeyFields = uniqueFields => (`
  _id
  title
  start
  end
  status
  rating
  isAdult
  isRepeat
  owned
  image
  link
  malId
  series_type
  series_start
  series_end
  timesCompleted
  updatedDate
  ${uniqueFields}
`);

export const itemEditFields = uniqueFields => (`
  ${itemKeyFields(uniqueFields)}
  tags
`);

export const historyKeyFields = uniqueField => (`
  _id
  parent
  date
  rating
  note
  ${uniqueField}
`)

export const historyKeyFieldsWithSeries = uniqueField => (`
  ${historyKeyFields(uniqueField)}
  series {
    _id
    title
  }
`)

export const taskKeyFields = (`
  _id
  description
  isComplete
  repeatFrequency
  repeatDay
`)
