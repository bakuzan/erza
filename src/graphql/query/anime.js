import { animeKeyFields, pagedData } from './common'

const getAll = `
  query allAnime {
    animes {
      ...animeKeyFields,
      ...pagedData
    }
  }
`;

const getByStatus = (status) => (`
  query animeByStatus {
    animes(status: ${status}) {
      ...animeKeyFields,
      ...pagedData
    }
  }
`);

const getById = (id) => (`
  query animeById {
    anime(id: "${id}") {
      ...animeKeyFields,
      rating,
      isRepeat,
    }
  }
`);

const AnimeQL = {
  getAll,
  getById,
  getByStatus
};

export default AnimeQL;
