const tagFields = `
  _id
  name
  isAdult
`;

const getAll = `
  {
    tagMany {
      ${tagFields}
    }
  }
`;

const TagQl = {
  getAll
};

export default TagQl
