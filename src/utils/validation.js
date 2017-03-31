import {Enums, Strings} from '../constants/values'

class ValidationUtil {

  validateAnimeModel(model, updateProperty) {
    return Object.assign({}, model, {
      episode: this.adjustEpisodeCount(model, updateProperty),
      status: this.deriveStatusFromState(model),
      end: this.shouldAnimeHaveEnd(model),
      isRepeat: this.handleRewatch(model, updateProperty)
    });
  }

  adjustEpisodeCount(model, property) {
    const {
      episode, status, series_episodes, isRepeat
    } = model;
    console.log(episode, series_episodes, isRepeat, property);
    if (episode > series_episodes) return series_episodes;
    if (isRepeat && property === Strings.isRepeat && episode === series_episodes) return 0;
    if (!isRepeat && property === Strings.isRepeat && status === Enums.anime.status.completed) return series_episodes;
    return episode;
  }

  deriveStatusFromState(model) {
    const {
      status, start, episode, series_episodes
    } = model;

    if (episode !== 0 && series_episodes !== 0 && episode === series_episodes) return Enums.anime.status.completed;
    const notSetToOtherStatus = status !== Enums.anime.status.onhold && status !== Enums.anime.status.dropped;
    if (notSetToOtherStatus && start) return Enums.anime.status.ongoing;
    if (notSetToOtherStatus && !start) return Enums.anime.status.planned;
    return status;
  }

  shouldAnimeHaveEnd(model) {
    const {
      end, episode, series_episodes, isRepeat
    } = model;

    if (!isRepeat && episode !== series_episodes) return '';
    if (episode !== 0 && series_episodes !== 0 && episode === series_episodes) return new Date().toISOString().split('T')[0];
    return end;
  }

  handleRewatch(model, property) {
    const {
      episode, series_episodes, isRepeat
    } = model;
    console.log('rewatch => ', property);
    if (isRepeat && property !== Strings.isRepeat && (episode !== 0 && series_episodes !== 0 && episode === series_episodes)) return false;
    return isRepeat;
  }

}

export default new ValidationUtil();
