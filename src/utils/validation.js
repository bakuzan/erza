import {Enums, Properties} from '../constants/values'

class ValidationUtil {

  validateAnimeModel(model, updateProperty) {
    return Object.assign({}, model, {
      episode: this.adjustEpisodeCount(model, updateProperty),
      status: this.deriveStatusFromState(model, updateProperty),
      end: this.shouldAnimeHaveEnd(model, updateProperty),
      isRepeat: this.handleRewatch(model, updateProperty),
      timesCompleted: this.handleTimesCompleted(model, updateProperty),
      tags: this.checkTagsType(model, updateProperty)
    });
  }

  adjustEpisodeCount(model, property) {
    const {
      episode, status, series_episodes, isRepeat
    } = model;
    console.log(episode, series_episodes, isRepeat, property);
    if (series_episodes !== 0 && episode > series_episodes) return series_episodes;
    if (isRepeat && property === Properties.isRepeat && episode === series_episodes) return 0;
    if (!isRepeat && property === Properties.isRepeat && status === Enums.anime.status.completed) return series_episodes;
    return episode;
  }

  deriveStatusFromState(model, property) {
    const {
      status, start, episode, series_episodes, isRepeat
    } = model;

    if (isRepeat || property === Properties.isRepeat) return status;
    if (episode !== 0 && series_episodes !== 0 && episode === series_episodes) return Enums.anime.status.completed;
    const notSetToOtherStatus = status !== Enums.anime.status.onhold && status !== Enums.anime.status.dropped;
    if (notSetToOtherStatus && start) return Enums.anime.status.ongoing;
    if (notSetToOtherStatus && !start) return Enums.anime.status.planned;
    return status;
  }

  shouldAnimeHaveEnd(model, property) {
    const {
      end, episode, series_episodes, isRepeat
    } = model;

    if (!isRepeat && property !== Properties.isRepeat && episode !== series_episodes) return '';
    if (!end && episode !== 0 && series_episodes !== 0 && episode === series_episodes) return new Date().toISOString().split('T')[0];
    return end;
  }

  handleRewatch(model, property) {
    const {
      episode, series_episodes, isRepeat
    } = model;
    console.log('rewatch => ', property);
    if (isRepeat && property !== Properties.isRepeat && (episode !== 0 && series_episodes !== 0 && episode === series_episodes)) return false;
    return isRepeat;
  }

  handleTimesCompleted(model, property) {
    const {
      episode, series_episodes, status, timesCompleted
    } = model;

    if (property === Properties.episode && (episode !== 0 && series_episodes !== 0 && episode === series_episodes)) return timesCompleted + 1;
    if (property === Properties.episode && status === Enums.anime.status.completed && (episode !== 0 && series_episodes !== 0 && episode !== series_episodes)) return timesCompleted - 1;
    return timesCompleted;
  }

  checkTagsType(model, property) {
    const { isAdult, tags } = model;
    if (property !== Properties.isAdult) return tags;
    return tags.filter(x => x.isAdult === isAdult);
  }

}

export default new ValidationUtil();
