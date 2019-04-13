import { Strings } from 'constants/values';
import GenericListQueries from './listItems';

export const mangaSpecificKeyFields = `
  chapter
  volume
  series_chapters
  series_volumes
`;

const getFilteredList = GenericListQueries.getFilteredList(
  Strings.manga,
  mangaSpecificKeyFields
);
const getById = GenericListQueries.getById(
  Strings.manga,
  mangaSpecificKeyFields
);
const getByIdForEdit = GenericListQueries.getByIdForEdit(
  Strings.manga,
  mangaSpecificKeyFields
);
const getByIdForQuickAdd = GenericListQueries.getByIdForQuickAdd(
  Strings.manga,
  mangaSpecificKeyFields
);

const MangaQL = {
  getById,
  getFilteredList,
  getByIdForEdit,
  getByIdForQuickAdd
};

export default MangaQL;
