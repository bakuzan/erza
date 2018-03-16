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
import { Welcome } from '@storybook/react/demo';

storiesOf('Welcome', module).add('to Storybook', () => (
  <Welcome showApp={linkTo('Button')} />
));
