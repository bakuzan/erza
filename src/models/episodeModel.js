import BaseHistoryModel from './baseHistoryModel';

class EpisodeModel extends BaseHistoryModel {
  constructor(props = {}) {
    super(props);
    Object.assign(this, this.initaliseDefaults(), props);
  }

  initaliseDefaults() {
    return Object.assign({}, super.initaliseDefaults(), {
      episode: 0,
      date: Date.now()
    });
  }
}

export default EpisodeModel;
