import { createStore, applyMiddleware } from 'redux';
import { routerMiddleware } from 'connected-react-router';
import thunk from 'redux-thunk';
import createRootReducer from '../reducers';

const configureStore = (history, preloadedState) =>
  createStore(
    createRootReducer(history),
    preloadedState,
    applyMiddleware(routerMiddleware(history), thunk)
  );

export default configureStore;
