import '../index.scss';
import '../styles/list.scss';
import '../styles/float-label.scss';
import '../styles/ripple.scss';
import '../styles/button.scss';
import '../styles/form.scss';
import '../styles/themes.scss';

import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';
import { Welcome } from '@storybook/react/demo';

storiesOf('Welcome', module).add('to Storybook', () => (
  <Welcome showApp={linkTo('Button')} />
));
