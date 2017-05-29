import {Paths} from '../../constants/paths'
import {Enums, Strings} from '../../constants/values'
import fetchFromServer from '../../graphql/fetch'
import AnimeValidator from './anime-creation'

var GENERATOR_VALUE;

const searchMyAnimeList = search => fetchFromServer(Paths.build(Paths.malSearch, { type: Strings.anime, search }));

const malResponseGenerator = anime => function* (response) {
  const item = response.find(x => x.id === anime.malId);

  if (!item)  return {};
  yield AnimeValidator.intergrateMalEntry({}, item);
}

const checkMal = anime => searchMyAnimeList(anime.title)
                          .then(malResponseGenerator(anime))
                          .then(generator => GENERATOR_VALUE = generator.next().value);

const updatePrePost = anime => {
  const holder = checkMal(anime);
  console.log('my gen > ', holder, GENERATOR_VALUE)
  const updates = GENERATOR_VALUE;

  // END
  if (anime.episode === anime.series_episodes && anime.series_episodes !== 0) {
      if (anime.end === undefined || anime.end === null) {
          updates.end = new Date().toISOString();
      }
  } else if (anime.isRepeat === false) {
      //in the event the 'complete-ness' of an entry needs to be undone.
      //this will undo the end date.
      updates.end = null;
  }

  // STATUS
  if(!!anime.end || !!updates.end) {
      updates.status = Enums.anime.status.completed;
  }

  // IS REPEAT
  if (anime.isRepeat && anime.episode === anime.series_episodes) {
      updates.timesCompleted = anime.timesCompleted + 1;
      updates.isRepeat = false;
  }

  console.log('%c pre post updates >> ', 'color: blue', updates);
  return Object.assign({}, anime, updates);
}

export default updatePrePost
