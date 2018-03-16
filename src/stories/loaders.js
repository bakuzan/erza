import React from 'react';
import { storiesOf } from '@storybook/react';

import Loaders from '../components/loaders/index';

storiesOf('Loading Bouncer', module).add('basic', () => (
  <div className="theme-one">
    <Loaders.LoadingBouncer />
  </div>
));

storiesOf('Loading Spinner', module)
  .add('basic', () => <Loaders.LoadingSpinner />)
  .add('fullscreen', () => <Loaders.LoadingSpinner size="fullscreen" />);

storiesOf('Loadables', module)
  .add('Loading with pastDelay', () => (
    <Loaders.Loadables.Loading pastDelay={true} />
  ))
  .add('Loading with timedOut', () => (
    <Loaders.Loadables.Loading timedOut={true} />
  ))
  .add('Loading with error', () => <Loaders.Loadables.Loading error={true} />)
  .add('SimpleLoading with pastDelay', () => (
    <Loaders.Loadables.SimpleLoading pastDelay={true} />
  ));
