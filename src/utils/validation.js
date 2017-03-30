import {Enums} from '../constants/values'

class ValidationUtil {

  validateAnimeModel(model) {
    return Object.assign({}, model, {
      status: this.deriveStatusFromState(model),
      end: this.shouldAnimeHaveEnd(model)
    });
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
    if (episode === series_episodes) return new Date().toISOString().split('T')[0];
    return end;
  }

}

export default new ValidationUtil();
