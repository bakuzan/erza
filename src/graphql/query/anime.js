import { animeKeyFields, pagedDataWrapper, constructFilterString } from './common'

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
    }
  }
`);

const getByIdForEdit = (id) => (`
  {
    animeById(_id: "${id}") {
      ${animeKeyFields}
      isRepeat
      link
      rating
      series_end
      series_start
      series_type
      tags
      timesCompleted
    }
  }
`);

const AnimeQL = {
  getById,
  getFilteredList,
  getByIdForEdit
};

export default AnimeQL;
