const INFO = 'INFO'
const SUCCESS = 'SUCCESS'
const ERROR = 'ERROR'
const WARNING = 'WARNING'

class ToasterService {
  constructor() {
    this.toaster = {};
  }
  
  register(toaster) {
    this.toaster = toaster;
  }
  
  popToast(newToast) {
    this.toaster.popToast(Object.assign({}, {
      time: Date.now(),
      type: INFO,
      title: 'Just so your aware',
      message: 'This is the default toast text!'
    }, newToast));
  }
  
  info(title, message) {
    this.popToast({ type: INFO, title, message });
  }
  success(title, message) {
      this.popToast({ type: SUCCESS, title, message });
  }
  error(title, message) {
      this.popToast({ type: ERROR, title, message });
  }
  warning(title, message) {
      this.popToast({ type: WARNING, title, message });
  }
}

const toaster = new ToasterService();
export default toaster;
