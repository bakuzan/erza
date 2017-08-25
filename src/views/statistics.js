import React, {Component, PropTypes} from 'react'
import {Link} from 'react-router'
import {connect} from 'react-redux'
import Elm from 'react-elm-components'

import {Paths} from '../constants/paths'
import {Strings} from '../constants/values'

import {Main} from '../../satellizer/build/static/js/satellizer'
import '../../satellizer/build/static/css/satellizer.css'


const ContentTypeFilter = () => (
  <div>
    <Link
     to={`${Paths.statistics}${Strings.anime}`}
     className="button-link"
     activeClassName="active">
     { Strings.anime }
    </Link>
    <Link
     to={`${Paths.statistics}${Strings.manga}`}
     className="button-link"
     activeClassName="active">
     { Strings.manga }
    </Link>
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
