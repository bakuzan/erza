import gql from 'graphql-tag';

const seriesMutationResponse = gql`
  fragment SeriesMutationResponse on SeriesResponse {
    success
    data {
      id
      title
    }
    errorMessages
  }
`;

// Anime

export const animeCreate = gql`
  mutation AnimeCreate($payload: AnimeCreateInput!) {
    animeCreate(payload: $payload) {
      ...SeriesMutationResponse
    }
  }
  ${seriesMutationResponse}
`;
export const animeUpdate = gql`
  mutation AnimeUpdate($payload: AnimeInput!) {
    animeUpdate(payload: $payload) {
      ...SeriesMutationResponse
    }
  }
  ${seriesMutationResponse}
`;
export const animeRemove = gql`
  mutation AnimeRemove($id: Int!) {
    animeRemove(id: $id) {
      success
      errorMessages
    }
  }
`;

// Manga

export const mangaCreate = gql`
  mutation MangaCreate($payload: MangaCreateInput!) {
    mangaCreate(payload: $payload) {
      ...SeriesMutationResponse
    }
  }
  ${seriesMutationResponse}
`;
export const mangaUpdate = gql`
  mutation MangaUpdate($payload: MangaInput!) {
    mangaUpdate(payload: $payload) {
      ...SeriesMutationResponse
    }
  }
  ${seriesMutationResponse}
`;
export const mangaRemove = gql`
  mutation MangaRemove($id: Int!) {
    mangaRemove(id: $id) {
      success
      errorMessages
    }
  }
`;
