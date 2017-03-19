import React, { PropTypes } from 'react'
import { Provider } from 'react-redux'
import Routes from '../../routes'
import DevTools from '../dev-tools'

const Root = ({ store, history }) => (
  <Provider store={store}>
    <div>
      <Routes history={history} />
      <DevTools />
    </div>
  </Provider>
)

Root.propTypes = {
  store: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
}

export default Root
