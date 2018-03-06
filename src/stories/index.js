import '../index.css';
import '../styles/list.css';
import '../styles/float-label.css';
import '../styles/ripple.css';
import '../styles/button.css';
import '../styles/form.css';
import '../styles/themes.css';

import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import { Button, Welcome } from '@storybook/react/demo';

import Alert from '../components/alert/alert';

storiesOf('Welcome', module).add('to Storybook', () => (
  <Welcome showApp={linkTo('Button')} />
));

storiesOf('Alert', module).add('basic', () => (
  <Alert
    alerts={[
      {
        id: 1,
        type: 'error',
        message: 'quick message',
        detail: 'Some text to display to user, with a lot of text here'
      }
    ]}
    actions={{ dismissAlertMessage: action('dismiss') }}
  />
));
