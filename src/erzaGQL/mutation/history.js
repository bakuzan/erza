import gql from 'graphql-tag';

export const episodeUpdate = gql``;
export const chapterUpdate = gql``;

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
