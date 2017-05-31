import updatePrePost from './anime-post'
import {Enums, Properties} from '../../constants/values'
import {formatDateForInput, dateStringToISOString} from '../date'

const episodeChangeHandler = (anime) => {
  const changes = {};
  if(anime.episode === anime.series_episodes && anime.series_episodes !== 0 && !anime.isRepeat) {
    changes.end = formatDateForInput(new Date());
    changes.status = Enums.anime.status.completed;
  } else if (
    anime.status === Enums.anime.status.completed &&
    anime.episode !== anime.series_episodes &&
    anime.series_episodes !== 0 && !anime.isRepeat
   ) {
     changes.end = null;
     changes.status = Enums.anime.status.ongoing;
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

const validateAnimeChanges = (model, updateProperty) => Object.assign({}, model, processValidatorChanges(model, updateProperty));

const validateAnimeSubmission = model => {
  const { start, end, series_start, series_end } = model;
  return updatePrePost(
     Object.assign({}, model, {
      tags: model.tags.map(tag => tag._id),
      start: !!model._id ? dateStringToISOString(start) : dateStringToISOString(new Date()),
      end: dateStringToISOString(end),
      series_start: dateStringToISOString(series_start),
      series_end: dateStringToISOString(series_end)
    })
  );
}

const intergrateMalEntry = (model, malItem) => {
  if (!malItem) return Object.assign({}, model, { malId: null });
  return Object.assign({}, model, {
    image: malItem.image,
    malId: malItem.id,
    series_type: Enums.anime.type[malItem.type.toLowerCase()], // 0 = Unknown, 1 = TV, 2 = OVA, 3 = Movie, 4 = Special, 5 = ONA, 6 = Music
    series_episodes: malItem.episodes,
    series_start: dateStringToISOString(malItem.start_date),
    series_end: dateStringToISOString(malItem.end_date)
  });
}

const AnimeValidator = {
  validateAnimeChanges,
  validateAnimeSubmission,
  intergrateMalEntry
}

export default AnimeValidator
