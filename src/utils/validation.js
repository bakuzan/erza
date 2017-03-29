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
      status, start, episode, series
    } = model;

    if (episode !== 0 && series.episodes !== 0 && episode === series.episodes) return Enums.anime.status.completed;
    const notSetToOtherStatus = status !== Enums.anime.status.onhold && status !== Enums.anime.status.dropped;
    if (notSetToOtherStatus && start) return Enums.anime.status.ongoing;
    if (notSetToOtherStatus && !start) return Enums.anime.status.planned;
    return status;
  }

  shouldAnimeHaveEnd(model) {
    const {
      end, episode, series, isRepeat
    } = model;

    if (!isRepeat && episode !== series.episodes) return '';
    if (episode === series.episodes) return new Date().toISOString().split('T')[0];
    return end;
  }

}

export default new ValidationUtil();
