import React, {Component} from 'react'


class ElmWrapper extends Component {

  componentDidMount() {
    this.renderElm(this.element)
  }

  shouldComponentUpdate() {
		return false;
	}

  renderElm(node) {
    const app = this.props.src.embed(node, this.props.flags);

    if (typeof this.props.ports !== 'undefined') {
      this.props.ports(app.ports);
    }
  }

	render() {
		return <div ref={el => this.element = el}></div>
	}
}

export default ElmWrapper
