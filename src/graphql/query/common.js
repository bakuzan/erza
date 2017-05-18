import {Types} from '../../constants/values'

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

const processType = (v) =>
  ((v || v === "") && typeof(v) === Types.string) ? `"${v}"` :
                (v instanceof Array)              ? v.reduce((ac, cu, i) => `${ac} ${processType(cu)}${appendArrayBreak(v, i)}`, '[') :
                                                    v;

export const constructRecordForPost = (record) => {
  return Object.keys(record).reduce((acc, curr, i, arr) => {
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

export const animeKeyFields = `
  _id
  title
  episode
  start
  end
  status
  isAdult
  owned
  image
  malId
  series_episodes
  updatedDate
`;

export const animeEditFields = `
  ${animeKeyFields}
  isRepeat
  link
  rating
  series_end
  series_start
  series_type
  tags
  timesCompleted
`;

export const tagFields = `
  _id
  name
  isAdult
`;
