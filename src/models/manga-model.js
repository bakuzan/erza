import BaseItemModel from './base-item-model'

class MangaModel extends BaseItemModel {
  constructor(props = {}) {
    super(props);
    Object.assign(this, this.initaliseDefaults(), props);
  }

  initaliseDefaults() {
    return Object.assign({}, super.initaliseDefaults(), {
      chapter: 0,
      volume: 0,
      series_chapters: 0,
      series_volumes: 0
    });
  }

}

export default MangaModel;
