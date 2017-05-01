import {animeEditFields} from '../query/common'

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
  updateAnimeById
};

export default AnimeML;
