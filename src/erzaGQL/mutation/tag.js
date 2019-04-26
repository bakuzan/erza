import gql from 'graphql-tag';

export const tagCreate = gql``;
export const tagUpdate = gql``;
export const tagRemove = gql`
  mutation TagRemove($id: Int!) {
    tagRemove(id: $id) {
      success
      errorMessages
    }
  }
`;
