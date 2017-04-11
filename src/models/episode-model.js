class EpisodeModel {
  constructor(props = this.initaliseDefaults()) {
    Object.assign(this, this.initaliseDefaults(), props);
  }
  
  initaliseDefaults() {
    return {
      parent: null,
      date: Date.now(),
      note: '',
      rating: null,
      episode: 0 // value or number
    };
  }
}

export default EpisodeModel
