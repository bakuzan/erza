import gql from 'graphql-tag';

export const getTagById = gql`
  query TagOne($id: Int!) {
    tagById(id: $id) {
      id
      name
      isAdult
      anime(sorting: ["title", "ASC"]) {
        id
        title
      }
      manga(sorting: ["title", "ASC"]) {
        id
        title
      }
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

export const getTagGraph = gql`
  query TagGraph($type: StatType!, $isAdult: Boolean!) {
    tagGraph(type: $type, isAdult: $isAdult) {
      nodes {
        id
        label
        value
        title
      }
      edges {
        from
        to
        value
        title
      }
    }
  }
`;
