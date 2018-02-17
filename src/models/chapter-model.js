import BaseHistoryModel from './base-history-model.js';

class ChapterModel extends BaseHistoryModel {
  constructor(props = {}) {
    super(props);
    Object.assign(this, this.initaliseDefaults(), props);
  }

  initaliseDefaults() {
    return Object.assign({}, super.initaliseDefaults(), {
      chapter: 0,
      date: Date.now()
    });
  }
}

export default ChapterModel;
