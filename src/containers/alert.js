import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Alert from '../components/alert/alert';

const mapStateToProps = state => ({
  ...state.alert
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Alert);
