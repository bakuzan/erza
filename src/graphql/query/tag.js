const getAll = `
  query allTags {
    tags {
      id,
      name,
      isAdult
    }
  }
`;

const TagQl = {
  getAll
};

export default TagQl
