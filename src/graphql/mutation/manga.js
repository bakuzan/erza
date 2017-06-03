import {mangaEditFields} from '../query/manga'

const createManga = (manga) => (`
  mutation {
    mangaCreate(record: ${manga}) {
      record: record {
        ${mangaEditFields}
      }
    }
  }
`)

const updateMangaById = (manga) => (`
  mutation {
    mangaUpdateById(record: ${manga}) {
      record: record {
        ${mangaEditFields}
      }
    }
  }
`)

const MangaML = {
  createManga,
  updateMangaById
};

export default MangaML;
