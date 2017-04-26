import {Strings, Types} from '../../constants/values'

export const constructPagingAndSorting = ({ itemsPerPage, pageInfo }, { sortKey, sortOrder }, pageChange) => {
  const pageCutOff = pageChange === Strings.next ? `after: "${pageInfo.forwardFrom}",`   :
                     pageChange === Strings.prev ? `before: "${pageInfo.backFrom}",`     :
                                                   ' ';
  return `
    first: ${itemsPerPage},
    ${pageCutOff}
    sort: ${sortKey.toUpperCase()}_${sortOrder},
  `;
}

const processType = (v) => v && typeof(v) === Types.string ? `"${v}"` : v;
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
    cursor
    node {
      ${fields}
    }
  }
  pageInfo {
    hasNextPage
    hasPreviousPage
    startCursor
    endCursor
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

export const tagFields = `
  _id
  name
  isAdult
`;
