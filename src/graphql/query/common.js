import {Strings} from '../../constants/values'

export const constructPagingAndSorting = (paging, { sortKey, sortOrder }, pageChange) => {
  return `
    first: ${paging.itemsPerPage},
    ${
       pageChange === Strings.next ? `after: "${paging.pageInfo.forwardFrom}",`   :
       pageChange === Strings.prev ? `before: "${paging.pageInfo.backFrom}",` :
                                      ' '
    }
    sort: ${sortKey.toUpperCase()}_${sortOrder},
  `;
}

export const constructFilterString = (filters) => {
  const properties = Object.keys(filters).reduce((acc, curr, i, arr) => {
    const value = filters[curr];
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
    hasNextPage,
    hasPreviousPage,
    startCursor,
    endCursor
  }
  count
`);

export const animeKeyFields = `
  _id,
  title,
  episode,
  start,
  end,
  status,
  isAdult,
  owned,
  image,
  malId,
  series_episodes,
  updatedDate
`;

export const tagFields = `
  _id,
  name,
  isAdult
`;
