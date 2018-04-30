import React from 'react';
import { render } from 'react-dom';
import createBrowserHistory from 'history/createBrowserHistory';
import Root from './containers/root/root';
import configureStore from './store/configure-store';
import './index.css';
import 'meiko/dist/bundle.css';
import './styles/themes.css';

export const history = createBrowserHistory();
export const store = configureStore(history);

if (document.getElementById('root').children.length === 0) {
  render(
    <Root store={store} history={history} />,
    document.getElementById('root')
  );
}
