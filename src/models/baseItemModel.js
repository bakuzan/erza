class BaseItemModel {
  constructor(props = {}) {
    Object.assign(this, this.initaliseDefaults(), props);
  }

  initaliseDefaults() {
    const now = new Date().toISOString().split('T')[0];
    return {
      title: '',
      status: 1, // 1 / ongoing, 2 / completed, 3 / onhold, 4 / dropped, 6 / planned
      rating: 0,
      isAdult: false,
      start: now,
      end: '',
      tags: Array(0), // Array of Tag id's
      owned: false,
      image: '',
      link: '',
      isRepeat: false,
      timesCompleted: 0,
      malId: null,
      // Series data populated by mal entry
      series_type: 0,
      series_start: null,
      series_end: null
    };
  }
}

export default BaseItemModel;
