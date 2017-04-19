import { animeKeyFields } from './common'
//pagedData, tagFields

const getAll = `
  query allAnime {
    animes {
      ${animeKeyFields}
    }
  }
`;

const getByStatus = (status) => (`
  query animeByStatus {
    animes(status: ${status}) {
      ${animeKeyFields}
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
  getByStatus,
  getByIdForEdit
};

export default AnimeQL;
