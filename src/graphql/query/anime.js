import { Strings } from 'constants/values';
import GenericListQueries from './list-items';

export const animeSpecificKeyFields = `
  episode
  series_episodes
`;

const animeSpecificKeyFieldsWithSeason = `
  ${animeSpecificKeyFields}
  season
`;

const animeSpecificKeyFieldsWithLegacyFlag = `
  ${animeSpecificKeyFields}
  _legacyIsSeason
`;

const getFilteredList = GenericListQueries.getFilteredList(
  Strings.anime,
  animeSpecificKeyFields
);
const getById = GenericListQueries.getById(
  Strings.anime,
  animeSpecificKeyFieldsWithSeason
);
const getByIdForEdit = GenericListQueries.getByIdForEdit(
  Strings.anime,
  animeSpecificKeyFieldsWithLegacyFlag
);
const getByIdForQuickAdd = GenericListQueries.getByIdForQuickAdd(
  Strings.anime,
  animeSpecificKeyFields
);

const AnimeQL = {
  getById,
  getFilteredList,
  getByIdForEdit,
  getByIdForQuickAdd
};

export default AnimeQL;
