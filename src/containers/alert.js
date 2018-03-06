import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Alert from '../components/alert/alert';
import * as actions from '../actions/alert';

const mapStateToProps = state => ({
  ...state.alert
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Alert);
