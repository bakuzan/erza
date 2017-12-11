import PropTypes from 'prop-types';
import React from 'react';
import { Provider } from 'react-redux'
import Routes from '../../routes'

const Root = ({ store, history }) => (
  <Provider store={store}>
    <div>
      <Routes history={history} />
    </div>
  </Provider>
)

Root.propTypes = {
  store: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
}

export default Root
