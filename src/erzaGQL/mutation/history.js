import gql from 'graphql-tag';

export const episodeUpdate = gql`
  mutation EpisodeUpdate($payload: HistoryInput!) {
    episodeUpdate(payload: $payload) {
      success
      data {
        id
        note
        rating
      }
      errorMessages
    }
  }
`;
export const chapterUpdate = gql`
  mutation ChapterUpdate($payload: HistoryInput!) {
    chapterUpdate(payload: $payload) {
      success
      data {
        id
        note
        rating
      }
      errorMessages
    }
  }
`;

export const episodeRemove = gql`
  mutation EpisodeRemove($id: Int!) {
    episodeRemove(id: $id) {
      success
      errorMessages
    }
  }
`;

export const chapterRemove = gql`
  mutation ChapterRemove($id: Int!) {
    chapterRemove(id: $id) {
      success
      errorMessages
    }
  }
`;
