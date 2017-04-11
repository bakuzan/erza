class TagModel {
  constructor(props = this.initaliseDefaults()) {
    Object.assign(this, this.initaliseDefaults(), props);
  }
  
  initaliseDefaults() {
    return {
      name: '',
      isAdult: false
    };
  }
}

export default TagModel
