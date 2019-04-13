import { createStore, applyMiddleware, compose } from 'redux';
import { routerMiddleware } from 'connected-react-router';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import createRootReducer from '../reducers';

const configureStore = (history, preloadedState) => {
  const store = createStore(
    createRootReducer(history),
    preloadedState,
    compose(
      applyMiddleware(
        routerMiddleware(history),
        thunk,
        createLogger({ collapsed: true })
      ),
      window.devToolsExtension && process.env.NODE_ENV !== 'production'
        ? window.devToolsExtension()
        : (f) => f
    )
  );

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers').default;
      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
};

export default configureStore;
