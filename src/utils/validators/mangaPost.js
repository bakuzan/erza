import { Strings } from 'constants/values';
import { applyUpdates } from './basePost';

const mangaUpdates = applyUpdates(Strings.manga);

export default function updatePrePost(manga) {
  return mangaUpdates(manga, {});
}
