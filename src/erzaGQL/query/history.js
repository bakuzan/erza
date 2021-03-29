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
    $sorting: [String]
    $ratings: [Int]
  ) {
    episodes(
      fromDate: $from
      toDate: $to
      isAdult: $isAdult
      paging: $paging
      sorting: $sorting
      ratings: $ratings
    ) {
      total
      hasMore
      nodes {
        ...HistoryFields
        episode
        series: anime {
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
    $sorting: [String]
    $ratings: [Int]
  ) {
    chapters(
      fromDate: $from
      toDate: $to
      isAdult: $isAdult
      paging: $paging
      sorting: $sorting
      ratings: $ratings
    ) {
      total
      hasMore
      nodes {
        ...HistoryFields
        chapter
        series: manga {
          id
          title
        }
      }
    }
  }
  ${historyFields}
`;

export const getEpisodesForSeries = gql`
  query EpisodesForSeries(
    $seriesId: Int!
    $paging: Paging
    $sorting: [String]
  ) {
    episodesForAnime(seriesId: $seriesId, paging: $paging, sorting: $sorting) {
      total
      hasMore
      nodes {
        ...HistoryFields
        episode
        series: anime {
          id
          title
        }
      }
      averageRating {
        mean
        median
        mode
        minimum
        maximum
      }
    }
  }
  ${historyFields}
`;

export const getChaptersForSeries = gql`
  query ChaptersForSeries(
    $seriesId: Int!
    $paging: Paging
    $sorting: [String]
  ) {
    chaptersForManga(seriesId: $seriesId, paging: $paging, sorting: $sorting) {
      total
      hasMore
      nodes {
        ...HistoryFields
        chapter
        series: manga {
          id
          title
        }
      }
      averageRating {
        mean
        median
        mode
        minimum
        maximum
      }
    }
  }
  ${historyFields}
`;
