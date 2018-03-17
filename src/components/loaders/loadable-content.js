import PropTypes from 'prop-types';
import React from 'react';

import LoadingSpinner from './loading-spinner/loading-spinner';

class LoadableContent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pastDelay: false
    };
    this.timer = null;
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isFetching && !this.props.isFetching)
      return this.handleDelayTimer();

    if (!nextProps.isFetching && this.props.isFetching) {
      clearTimeout(this.timer);
      return this.setState({ pastDelay: false });
    }
  }

  handleDelayTimer() {
    clearTimeout(this.timer);
    this.timer = setTimeout(
      () => this.setState({ pastDelay: true }),
      this.props.spinnerDelay
    );
  }

  render() {
    if (this.props.isFetching && this.state.pastDelay)
      return <LoadingSpinner size={this.props.spinnerSize} />;

    return this.props.children;
  }
}

LoadableContent.defaultProps = {
  spinnerSize: 'fullscreen',
  spinnerDelay: 1100
};

LoadableContent.propTypes = {
  isFetching: PropTypes.bool.isRequired,
  spinnerSize: PropTypes.string,
  spinnerDelay: PropTypes.number
};

export default LoadableContent;
