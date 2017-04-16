const getAll = `
  query allTags {
    tags {
      _id,
      name,
      isAdult
    }
  }
`;

const TagQl = {
  getAll
};

export default TagQl
