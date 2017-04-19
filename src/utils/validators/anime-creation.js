import {Enums, Properties} from '../constants/values'

{
    episode: this.adjustEpisodeCount(model, updateProperty),
    status: this.deriveStatusFromState(model, updateProperty),
    end: this.shouldAnimeHaveEnd(model, updateProperty),
    isRepeat: this.handleRewatch(model, updateProperty),
    timesCompleted: this.handleTimesCompleted(model, updateProperty),
    tags: this.checkTagsType(model, updateProperty)
  }

const validateAnimeChanges = (model, updateProperty) => {
  return Object.assign({}, model, processValidatorChanges(model, updateProperty));
}

const validateAnimeSubmission = (model) => {
  console.warn('validateAnimeSubmission not implemented!');
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
  if(anime.episode === anime.series_episodes && anime.series_episodes !== 0 && anime.isRepeat === false) {
    changes.end = new Date();
    changes.status = Enums.anime.status.completed;
  }
  if(anime.episode > anime.series_episodes && anime.series_episodes !== 0) {
    changes.episode = anime.series_episodes;
  }
  return Object.assign({}, changes);
}

const statusChangeHandler = (anime) => {
  const {} = Enums.anime.status;
  switch(anime.status) {
    case 
  }
}

const repeatChangeHandler = (anime) => {
  return { episode: anime.isRepeat ? 0 : anime.series_episodes };
}

const animeValidator = {
  validateAnimeChanges,
  validateAnimeSubmission
}

export default AnimeValidator
