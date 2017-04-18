export const pagedData = `
  pageInfo {
    hasNextPage,
    hasPreviousPage,
    startCursor,
    endCursor
  }
  totalCount
`;

export const animeKeyFields = `
  fragment keyFields on Anime {
    id,
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
  }
`;
