import gql from 'graphql-tag';

export const tagUpdate = gql`
  mutation TagUpdate($payload: TagInput!) {
    tagUpdate(payload: $payload) {
      success
      data {
        id
        name
        isAdult
      }
      errorMessages
    }
  }
`;
export const tagRemove = gql`
  mutation TagRemove($id: Int!) {
    tagRemove(id: $id) {
      success
      errorMessages
    }
  }
`;
