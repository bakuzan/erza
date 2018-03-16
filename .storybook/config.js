import { configure } from '@storybook/react';

function loadStories() {
  require('../src/stories');
  require('../src/stories/ui-messages');
  require('../src/stories/loaders');
}

configure(loadStories, module);
