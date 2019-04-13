import React from 'react';
import { render } from 'react-dom';
import { createBrowserHistory } from 'history';
import { Provider } from 'react-redux';

import Routes from './Routes';
import configureStore from './store';

import registerServiceWorker from './registerServiceWorker';

import './index.scss';
import './styles/themes.scss';

export const history = createBrowserHistory();
export const store = configureStore(history);

if (document.getElementById('root').children.length === 0) {
  render(
    <Provider store={store}>
      <Routes history={history} />
    </Provider>,
    document.getElementById('root')
  );
}
registerServiceWorker();
