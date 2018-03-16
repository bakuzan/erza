import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import Alert from '../components/alert/alert';

const defaultMessage = {
  id: 1,
  type: 'default',
  message: 'quick message',
  detail: 'Some text to display to user, with a lot of text here'
};

storiesOf('Alert', module)
  .add('info', () => (
    <Alert
      alerts={[
        {
          ...defaultMessage,
          type: 'info'
        }
      ]}
      actions={{ dismissAlertMessage: action('dismiss') }}
    />
  ))
  .add('error', () => (
    <Alert
      alerts={[
        {
          ...defaultMessage,
          type: 'error'
        }
      ]}
      actions={{ dismissAlertMessage: action('dismiss') }}
    />
  ));
