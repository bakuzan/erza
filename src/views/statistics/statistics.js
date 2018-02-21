import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import ElmWrapper from '../../components/elm-wrapper';
import ContentTypeFilters from './content-type-filters';
import {
  debounce,
  getTimeoutSeconds,
  createListeners
} from '../../utils/common';

import { Main } from 'satellizer/js/satellizer';
import 'satellizer/css/satellizer.css';
import '../../components/radio-button/radio-button.css';
import '../../components/tab-container/tab-container.css';

const processScroll = page => () => {
  debounce(() => {
    const container = document.getElementById('history-breakdown-detail');
    const required = container && container.getBoundingClientRect().top < 55;
    page.ports.requireKey.send(!!required);
  }, getTimeoutSeconds(0.15));
};

class Statistics extends Component {
  constructor(props) {
    super(props);

    this.setupPorts = this.setupPorts.bind(this);
    this.scrollController = createListeners('scroll', processScroll(this))();
  }

  componentDidMount() {
    this.scrollController.listen();
  }

  componentWillUnmount() {
    this.scrollController.remove();
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.contentType !== this.props.contentType ||
      nextProps.isAdult !== this.props.isAdult
    ) {
      this.ports.contentType.send(nextProps.contentType);
      this.ports.isAdult.send(nextProps.isAdult);
    }
  }

  setupPorts(ports) {
    this.ports = ports;
  }

  render() {
    const { isAdult, contentType } = this.props;
    const flags = { isAdult, contentType };

    return (
      <div className="flex-column">
        <ContentTypeFilters />
        <div id="satellizer">
          <ElmWrapper src={Main} flags={flags} ports={this.setupPorts} />
        </div>
      </div>
    );
  }
}

Statistics.propTypes = {
  isFetching: PropTypes.bool.isRequired,
  isAdult: PropTypes.bool.isRequired,
  contentType: PropTypes.string.isRequired
};

const mapStateToProps = (state, ownProps) => ({
  isFetching: state.isFetching,
  isAdult: state.isAdult,
  contentType: ownProps.match.params.type
});

export default connect(mapStateToProps)(Statistics);