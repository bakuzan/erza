import { itemKeyFields, itemEditFields, pagedDataWrapper, constructFilterString } from '../common'

const animeSpecificKeyFields = `
  episode
  series_episodes
`;
export const animeKeyFields = itemKeyFields(animeSpecificKeyFields);
export const animeEditFields = itemEditFields(animeSpecificKeyFields);

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
      series_start
      series_type
	  _legacyIsSeason
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
