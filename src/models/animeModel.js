import BaseItemModel from './baseItemModel';

class AnimeModel extends BaseItemModel {
  constructor(props = {}) {
    super(props);
    Object.assign(this, this.initaliseDefaults(props));
  }

  initaliseDefaults(props = {}) {
    return Object.assign(
      {
        episode: 0,
        series_episodes: 0
      },
      super.initaliseDefaults(props)
    );
  }
}

export default AnimeModel;
