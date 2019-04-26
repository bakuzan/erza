import gql from 'graphql-tag';

// Fragment

const historyFields = gql`
  fragment HistoryFields on History {
    id
    date
    rating
    note
  }
`;

// Queries

// Paged
export const getEpisodes = gql`
  query Episodes(
    $from: String
    $to: String
    $isAdult: Boolean
    $paging: Paging
    $ratings: [Int]
  ) {
    episodes(
      fromDate: $from
      toDate: $to
      isAdult: $isAdult
      paging: $paging
      ratings: $ratings
    ) {
      total
      hasMore
      nodes {
        ...HistoryFields
        episode
        anime {
          id
          title
        }
      }
    }
  }
  ${historyFields}
`;

export const getChapters = gql`
  query Chapters(
    $from: String
    $to: String
    $isAdult: Boolean
    $paging: Paging
    $ratings: [Int]
  ) {
    chapters(
      fromDate: $from
      toDate: $to
      isAdult: $isAdult
      paging: $paging
      ratings: $ratings
    ) {
      total
      hasMore
      nodes {
        ...HistoryFields
        chapter
        manga {
          id
          title
        }
      }
    }
  }
  ${historyFields}
`;
