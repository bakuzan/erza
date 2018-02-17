import { createStore, applyMiddleware } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import thunk from 'redux-thunk';
import rootReducer from '../reducers';

const configureStore = (history, preloadedState) =>
  createStore(
    rootReducer,
    preloadedState,
    applyMiddleware(routerMiddleware(history), thunk)
  );

export default configureStore;
