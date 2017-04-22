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
    viewer {
      animes(${pageParameters}${constructFilterString(filters)}) {
        ${pagedDataWrapper(animeKeyFields)}
      }
    }
  }
`);

const getById = (id) => (`
  query animeById {
    anime(id: "${id}") {
      ${animeKeyFields},
      rating,
      isRepeat,
    }
  }
`);

const getByIdForEdit = (id) => (`
  query animeForEdit {
    anime(id: "${id}") {
      ${animeKeyFields},
      isRepeat,
      link,
      rating,
      series_end,
      series_start,
      series_type,
      tags {
        edges {
          node {
            id
          }
        }
      },
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
