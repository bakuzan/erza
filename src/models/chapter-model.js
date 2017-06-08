import BaseHistoryModel from './base-history-model.js'

class ChapterModel extends BaseHistoryModel {
  constructor(props = {}) {
    super();
    Object.assign(this, this.initaliseDefaults(), props);
  }

  initaliseDefaults() {
    return Object.assign({}, super.initaliseDefaults(), {
      chapter: 0
    });
  }
}

export default ChapterModel
