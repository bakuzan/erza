const tagFields = `
  _id
  name
  isAdult
`;

const getAll = isAdult => `
  {
    tagMany(filter: { isAdult: ${isAdult} }) {
      ${tagFields}
    }
  }
`;

const getList = isAdult => `
  {
    tagMany(filter: { isAdult: ${isAdult} }) {
      _id
      name
      animeWithTag {
        _id
        title
      }
      mangaWithTag {
        _id
        title
      }
    }
  }
`;

const TagQl = {
  getAll,
  getList
};

export default TagQl;
