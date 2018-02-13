import React from 'react';
import { render } from 'react-dom';
import createBrowserHistory from 'history/createBrowserHistory';
import Root from './containers/root/root';
import configureStore from './store/configure-store';
import './index.css';
import './styles/list.css';
import './styles/float-label.css';
import './styles/ripple.css';
import './styles/button.css';
import './styles/form.css';
import './styles/themes.css';

export const history = createBrowserHistory();
export const store = configureStore(history);

if (document.getElementById('root').children.length === 0) {
  render(
    <Root store={store} history={history} />,
    document.getElementById('root')
  );
}
