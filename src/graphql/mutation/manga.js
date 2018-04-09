import { itemEditFields } from '../common';
import { mangaSpecificKeyFields } from '../query/manga';

const mangaEditFields = itemEditFields(mangaSpecificKeyFields);

const createManga = manga => `
  mutation {
    mangaCreate(record: ${manga}) {
      record: record {
        ${mangaEditFields}
      }
    }
  }
`;

const updateMangaById = manga => `
  mutation {
    mangaUpdateById(record: ${manga}) {
      record: record {
        ${mangaEditFields}
      }
    }
  }
`;

const MangaML = {
  createManga,
  updateMangaById
};

export default MangaML;
