import { Strings } from 'constants/values';
import { searchAnime, malResponseGenerator, applyUpdates } from './basePost';

const animeUpdates = applyUpdates(Strings.anime);

const updatePrePost = (anime) =>
  searchAnime(anime.title)
    .then(malResponseGenerator(Strings.anime, anime))
    .then((malItem) => animeUpdates(anime, malItem));

export default updatePrePost;
