import Enums from 'constants/enums';

class BaseItemModel {
  constructor(props = {}) {
    Object.assign(this, this.initaliseDefaults(props));
  }

  initaliseDefaults(props = {}) {
    const { season, timesCompleted, updatedAt, ...values } = props;
    const now = new Date().toISOString().split('T')[0];

    return {
      title: '',
      status: Enums.status.Ongoing,
      rating: 0,
      isAdult: false,
      start: now,
      end: '',
      tags: [],
      owned: false,
      image: '',
      link: '',
      isRepeat: false,
      malId: null,
      // Series data populated by mal entry
      series_type: Enums.seriesType.Unknown,
      series_start: null,
      series_end: null,
      ...values
    };
  }
}

export default BaseItemModel;
