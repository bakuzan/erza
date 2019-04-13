import { connect } from 'react-redux';

import { RequestIndicator } from 'mko';

const mapStateToProps = (state) => ({
  hide: state.requestIndicator.isHidden,
  requestInFlight: !!state.requestIndicator.requests.length
});

export default connect(mapStateToProps)(RequestIndicator);
