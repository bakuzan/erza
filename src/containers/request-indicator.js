import React from 'react';
import { connect } from 'react-redux';

import { RequestIndicator } from 'meiko';

const Indicator = props => (
  <RequestIndicator {...props} id="request-indicator" />
);

const mapStateToProps = state => ({
  hide: state.requestIndicator.isHidden,
  requestInFlight: !!state.requestIndicator.requests.length
});

export default connect(mapStateToProps)(Indicator);
