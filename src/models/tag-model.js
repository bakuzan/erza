class TagModel {
  constructor(props) {
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
