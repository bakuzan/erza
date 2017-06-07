import {Types, NonPostableProperties} from '../constants/values'

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
const processType = (v) =>
  ((v || v === "") && typeof(v) === Types.string) ? `"${v}"` :
                             (v instanceof Array) ? processArray(v) :
                                                    v;

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
  isAdult
  isRepeat
  owned
  image
  link
  malId
  timesCompleted
  updatedDate
  ${uniqueFields}
`);

export const itemEditFields = uniqueFields => (`
  ${itemKeyFields(uniqueFields)}
  rating
  series_end
  series_start
  series_type
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
