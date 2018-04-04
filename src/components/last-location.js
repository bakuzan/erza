import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as actions from 'actions/last-location';

const UrlsToIgnore = [];

export default function withLastLocation(WrappedComponent) {
  class LastLocationWrapper extends React.Component {
    constructor(props) {
      super(props);
      this.state = {};
    }

    componentWillReceiveProps(nextProps) {
      if (UrlsToIgnore.includes(this.props.location.pathname)) return;

      this.props._LastLocationActions.updateLastLocation(this.props.location);
    }

    render() {
      return <WrappedComponent {...this.props} lastLocation={this.state} />;
    }
  }

  const mapDispatchToProps = dispatch => ({
    _LastLocationActions: bindActionCreators(actions, dispatch)
  });

  return connect(null, mapDispatchToProps)(LastLocationWrapper);
}
