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

    componentDidUpdate(prevProps) {
      if (UrlsToIgnore.includes(prevProps.location.pathname)) return;

      this.props._LastLocationActions.updateLastLocation(prevProps.location);
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
