import gql from 'graphql-tag';

export const animeUpdateWithHistory = gql`
  mutation AnimeUpdateWithHistory(
    $series: SeriesInput!
    $history: [HistoryCreateInput]
  ) {
    animeUpdateWithHistory(series: $series, history: $history) {
      success
      errorMessages
      data {
        id
        title
      }
    }
  }
`;

export const mangaUpdateWithHistory = gql`
  mutation MangaUpdateWithHistory(
    $series: SeriesInput!
    $history: [HistoryCreateInput]
  ) {
    mangaUpdateWithHistory(series: $series, history: $history) {
      success
      errorMessages
      data {
        id
        title
      }
    }
  }
`;
