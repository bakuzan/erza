import {animeEditFields} from '../query/anime'

const createAnime = (anime) => (`
  mutation {
    animeCreate(record: ${anime}) {
      record: record {
        ${animeEditFields}
      }
    }
  }
`)

const updateAnimeById = (anime) => (`
  mutation {
    animeUpdateById(record: ${anime}) {
      record: record {
        ${animeEditFields}
      }
    }
  }
`)

const AnimeML = {
  createAnime,
  updateAnimeById
};

export default AnimeML;
