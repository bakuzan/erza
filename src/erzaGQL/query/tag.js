import gql from 'graphql-tag';

export const getTagById = gql`
  query TagOne($id: Int!) {
    tagById(id: $id) {
      id
      name
      isAdult
    }
  }
`;

export const getTagsMinimal = gql`
  query Tags($search: String, $isAdult: Boolean) {
    tags(search: $search, isAdult: $isAdult) {
      id
      name
    }
  }
`;

export const getTags = gql`
  query Tags($search: String, $isAdult: Boolean) {
    tags(search: $search, isAdult: $isAdult) {
      id
      name
      isAdult
    }
  }
`;
