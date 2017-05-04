import {Enums, Properties} from '../../constants/values'
import {formatDateForInput} from '../common'

const episodeChangeHandler = (anime) => {
  const changes = {};
  if(anime.episode === anime.series_episodes && anime.series_episodes !== 0 && !anime.isRepeat) {
    changes.end = formatDateForInput(new Date());
    changes.status = Enums.anime.status.completed;
  }
  if(anime.episode > anime.series_episodes && anime.series_episodes !== 0) {
    changes.episode = anime.series_episodes;
  }
  return Object.assign({}, changes);
}

const statusChangeHandler = (anime) => {
  const { planned, ongoing } = Enums.anime.status;
  switch(anime.status) {
      case planned   : return { start: '', end: '' };
      case ongoing   : return { start: formatDateForInput(new Date()), end: '' };
      default        : return {};
  }
}

const repeatChangeHandler = (anime) => {
  return { episode: anime.isRepeat ? 0 : anime.series_episodes };
}

const processValidatorChanges = (anime, property) => {
  switch(property) {
    case Properties.episode  : return episodeChangeHandler(anime);
    case Properties.status   : return statusChangeHandler(anime);
    case Properties.isRepeat : return repeatChangeHandler(anime);
    default                  : return {};
  }
}

const validateAnimeChanges = (model, updateProperty) => {
  return Object.assign({}, model, processValidatorChanges(model, updateProperty));
}

const validateAnimeSubmission = (model) => {
  return Object.assign({}, state, {
    tags: state.tags.map(tag => tag._id) 
  });
}

const AnimeValidator = {
  validateAnimeChanges,
  validateAnimeSubmission
}

export default AnimeValidator
