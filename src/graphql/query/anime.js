import { animeKeyFields, animeEditFields, pagedDataWrapper, constructFilterString } from './common'

const getFilteredList = (pageParameters, filters) => (`
  {
    animeConnection(${pageParameters}${constructFilterString(filters)}) {
      ${pagedDataWrapper(animeKeyFields)}
    }
  }
`);

const getById = (id) => (`
  {
    animeById(_id: "${id}") {
      ${animeKeyFields}
      rating
      isRepeat
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
    animeById(_id: "${id}") {
      ${animeEditFields}
    }
  }
`);

const AnimeQL = {
  getById,
  getFilteredList,
  getByIdForEdit
};

export default AnimeQL;
