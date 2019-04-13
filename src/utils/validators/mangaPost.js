import { Strings } from 'constants/values';
import { searchManga, malResponseGenerator, applyUpdates } from './basePost';

const mangaUpdates = applyUpdates(Strings.manga);

const updatePrePost = (manga) =>
  searchManga(manga.title)
    .then(malResponseGenerator(Strings.manga, manga))
    .then((malItem) => mangaUpdates(manga, malItem));

export default updatePrePost;
