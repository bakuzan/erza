import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';

class Portal extends React.Component {
  constructor(props) {
    super(props);

    this.el = document.createElement(props.parentTag);
    this.targetNode = document.querySelector(props.targetTagName);
  }

  componentDidMount() {
    this.targetNode.appendChild(this.el);
  }

  componentWillUnmount() {
    this.targetNode.removeChild(this.el);
  }

  render() {
    return ReactDOM.createPortal(this.props.children, this.el);
  }
}

Portal.defaultProps = {
  parentTag: 'div'
};

Portal.propTypes = {
  parentTag: PropTypes.string,
  targetTagName: PropTypes.string.isRequired
};

export default Portal;
