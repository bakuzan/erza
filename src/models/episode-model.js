import BaseHistoryModel from './base-history-model.js'

class EpisodeModel extends BaseHistoryModel {
  constructor(props = {}) {
    super();
    Object.assign(this, this.initaliseDefaults(), props);
  }

  initaliseDefaults() {
    return Object.assign({}, super.initaliseDefaults(), {
      episode: 0
    });
  }
}

export default EpisodeModel
