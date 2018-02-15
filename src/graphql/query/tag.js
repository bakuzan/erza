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
    }
  }
`;

const getById = id => `
  {
    tagById(_id: "${id}") {
      _id
      name
      animeWithTag(sort: TITLE_DESC) {
        _id
        title
      }
      mangaWithTag(sort: TITLE_DESC) {
        _id
        title
      }
    }
  }
`;

const TagQl = {
  getAll,
  getList,
  getById
};

export default TagQl;
