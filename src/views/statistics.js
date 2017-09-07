import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import Elm from 'react-elm-components'

import FilterLink from '../containers/filter-link/filter-link'
import {Paths} from '../constants/paths'
import {Strings} from '../constants/values'

import {Main} from '../../satellizer/build/static/js/satellizer'
import '../../satellizer/build/static/css/satellizer.css'


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
  }

  shouldComponentUpdate() {
    return false;
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
          <Elm src={Main} flags={flags} ports={this.setupPorts} />
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
