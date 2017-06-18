class BaseHistoryModel {
  constructor(props = {}) {
    Object.assign(this, this.initaliseDefaults(), props);
  }

  initaliseDefaults() {
    return {
      parent: null,
      date: Date.now(),
      note: '',
      rating: null
    };
  }
}

export default BaseHistoryModel
