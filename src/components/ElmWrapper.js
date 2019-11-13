import React, { Component } from 'react';

class ElmWrapper extends Component {
  componentDidMount() {
    this.renderElm(this.element);
  }

  shouldComponentUpdate() {
    return false;
  }

  renderElm(node) {
    const { src, flags } = this.props;
    if (!src) {
      console.error(
        'Undefined Prop `src`: ElmWrapper was not provided with a `src` value'
      );

      return;
    }

    const srcMain = src.Elm.Main;
    const app = srcMain.init({ node, flags });
    if (typeof this.props.ports !== 'undefined') {
      this.props.ports(app.ports);
    }
  }

  render() {
    return <div ref={(el) => (this.element = el)} />;
  }
}

export default ElmWrapper;
