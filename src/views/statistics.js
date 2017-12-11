import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {connect} from 'react-redux'

import ElmWrapper from '../components/elm-wrapper'
import FilterLink from '../containers/filter-link/filter-link'
import {Paths} from '../constants/paths'
import {Strings} from '../constants/values'
import {debounce, getTimeoutSeconds, createListeners} from '../utils/common'

import {Main} from 'satellizer/js/satellizer'
import 'satellizer/css/satellizer.css'


const processScroll = page => () => {
  debounce(() => {
    const container = document.getElementById("history-breakdown-detail")
    const required = container && (container.getBoundingClientRect().top < 55)
    page.ports.requireKey.send(required)
  }, getTimeoutSeconds(0.15))
}

const ContentTypeFilters = () => (
  <div className="button-group">
    <FilterLink filter={`${Paths.base}${Paths.statistics}${Strings.anime}`}>
     { Strings.anime }
    </FilterLink>
    <FilterLink filter={`${Paths.base}${Paths.statistics}${Strings.manga}`}>
     { Strings.manga }
    </FilterLink>
  </div>
)

class Statistics extends Component {

  constructor(props) {
    super(props);

    this.setupPorts = this.setupPorts.bind(this);
    this.scrollController = createListeners("scroll", processScroll(this))();
  }

  shouldComponentUpdate() {
    return false;
  }

  componentDidMount() {
    this.scrollController.listen()
  }

  componentWillUnmount() {
    this.scrollController.remove()
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.contentType !== this.props.contentType || nextProps.isAdult !== this.props.isAdult) {
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
  contentType: PropTypes.string.isRequired,
}


const mapStateToProps = (state, ownProps) => ({
  isFetching: state.isFetching,
  isAdult: state.isAdult,
  contentType: ownProps.params.type
})


export default connect(
  mapStateToProps
)(Statistics)
