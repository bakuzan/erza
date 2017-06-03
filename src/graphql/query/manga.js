import { itemKeyFields, itemEditFields, pagedDataWrapper, constructFilterString } from '../common'

const mangaSpecificKeyFields = `
  chapter
  volume
  series_chapters
  series_volumes
`;
const mangaKeyFields = itemKeyFields(mangaSpecificKeyFields);
const mangaEditFields = itemEditFields(mangaSpecificKeyFields);

const getFilteredList = (pageParameters, filters) => (`
  {
    mangaConnection(${pageParameters}${constructFilterString(filters)}) {
      ${pagedDataWrapper(mangaKeyFields)}
    }
  }
`);

const getById = (id) => (`
  {
    mangaById(_id: "${id}") {
      ${mangaKeyFields}
      rating
      series_start
      season
      tagList {
        _id
        name
      }
    }
  }
`);

const getByIdForEdit = (id) => (`
  {
    mangaById(_id: "${id}") {
      ${mangaEditFields}
    }
  }
`);

const MangaQL = {
  getById,
  getFilteredList,
  getByIdForEdit
};

export default MangaQL;
