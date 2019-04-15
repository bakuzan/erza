import { Strings } from 'constants/values';
import { applyUpdates } from './basePost';

const animeUpdates = applyUpdates(Strings.anime);

export default function updatePrePost(anime) {
  return animeUpdates(anime, {});
}
