import PropTypes from 'prop-types';
import React from 'react';
import { Provider } from 'react-redux'
import Routes from '../../routes'

const Root = ({ store, history }) => (
  <Provider store={store}>
      <Routes history={history} />
  </Provider>
)

Root.propTypes = {
  store: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
}

export default Root
