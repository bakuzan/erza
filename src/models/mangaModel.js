import BaseItemModel from './baseItemModel';

class MangaModel extends BaseItemModel {
  constructor(props = {}) {
    super(props);
    Object.assign(this, this.initaliseDefaults(props));
  }

  initaliseDefaults(props = {}) {
    return Object.assign(
      {
        chapter: 0,
        volume: 0,
        series_chapters: 0,
        series_volumes: 0
      },
      super.initaliseDefaults(props)
    );
  }
}

export default MangaModel;
