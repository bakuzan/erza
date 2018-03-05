import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import './alert.css';

const AlertMessage = ({ type, message, detail }) => (
  <div className={classNames('alert', [`${type}`])}>
    <span>{message}</span>
    <div>
      <button>X</button>
    </div>
    <div>{detail}</div>
  </div>
);

const Alert = ({ alerts, actions }) => (
  <div id="alert-container">
    {alerts.slice(0, 1).map(a => <AlertMessage data={a} />)}
  </div>
);

const mapStateToProps = state => ({
  ...state.alert
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Alert);
