import {Enums, Properties} from '../constants/values'

const validateAnimeChanges = (model, updateProperty) => {
  return Object.assign({}, model, processValidatorChanges(model, updateProperty));
}

const processValidatorChanges = (anime, property) => {
  switch(property) {
    case Properties.episode  : return episodeChangeHandler(anime);
    case Properties.status   : return statusChangeHandler(anime);
    case Properties.isRepeat : return repeatChangeHandler(anime);
    default                  : return {};
  }
}

const episodeChangeHandler = (anime) => {
  const changes = {};
  if(anime.episode === anime.series_episodes && anime.series_episodes !== 0 && !anime.isRepeat) {
    changes.end = new Date();
    changes.status = Enums.anime.status.completed;
  }
  if(anime.episode > anime.series_episodes && anime.series_episodes !== 0) {
    changes.episode = anime.series_episodes;
  }
  return Object.assign({}, changes);
}

const statusChangeHandler = (anime) => {
  const { planned, ongoing, completed } = Enums.anime.status;
  switch(anime.status) {
      case planned   : return { start: '', end: '' };
      case ongoing   : return { start: new Date(), end: '' };
      default        : return {};
  }
}

const repeatChangeHandler = (anime) => {
  return { episode: anime.isRepeat ? 0 : anime.series_episodes };
}

const validateAnimeSubmission = (model) => {
  console.warn('validateAnimeSubmission not implemented!');
}

const animeValidator = {
  validateAnimeChanges,
  validateAnimeSubmission
}

export default AnimeValidator
