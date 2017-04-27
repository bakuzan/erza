import { animeKeyFields, pagedDataWrapper, constructFilterString } from './common'

const getAll = `
  query allAnime {
    animes {
      ${animeKeyFields}
    }
  }
`;

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
      tags {
        edges {
          node {
            _id
          }
        }
      }
      timesCompleted
    }
  }
`);

const AnimeQL = {
  getAll,
  getById,
  getFilteredList,
  getByIdForEdit
};

export default AnimeQL;
