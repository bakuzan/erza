import React, { Component } from 'react'
import toaster from '../../utils/toaster'
import './toaster.css'

class Toaster extends Component {
  constructor() {
    super();
    this.state = {
      stack: Array(0)
    };
    this.cooldown = null;

    toaster.register(this);
  }

  removeColdToast() {
    return this.state.stack.filter(x => x.time > Date.now() - 3000);
  }

  removeToast(time) {
    const warmToast = this.removeColdToast();
    const remainingToast = warmToast.filter(x => x.time !== time);
    this.setState({ stack: remainingToast });
  }

  eatToast() {
    clearTimeout(this.cooldown);
    this.cooldown = setTimeout(() => {
      this.removeToast();
    }, 3000);
  }

  popToast(toast) {
    this.setState({ stack: [...this.state.stack, toast] });
    this.eatToast();
  }

  render() {
    const list = this.state.stack || Array(0);

    return (
      <div id="toaster">
      {
        list.map(item => {
          return (
            <span key={item.time}
                  className={`toast ${item.type.toLowerCase()}`}
                  onClick={() => this.removeToast(item.time)}>
              <span className="title">{ item.title }</span>
              <span className="message">{ item.message }</span>
            </span>
          );
        })
      }
      </div>
    );
  }
}

export default Toaster