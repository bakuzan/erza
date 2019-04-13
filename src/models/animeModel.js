import BaseItemModel from './baseItemModel';

class AnimeModel extends BaseItemModel {
  constructor(props = {}) {
    super(props);
    Object.assign(this, this.initaliseDefaults(), props);
  }

  initaliseDefaults() {
    return Object.assign({}, super.initaliseDefaults(), {
      episode: 0,
      series_episodes: 0
    });
  }
}

export default AnimeModel;
