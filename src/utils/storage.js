import Store from 'ayaka/localStorage';

import { Strings } from 'constants/values';

function defaultSettings() {
  return {
    pageSize: {
      [Strings.anime]: 10,
      [Strings.manga]: 10,
      [Strings.episode]: 25,
      [Strings.chapter]: 25
    }
  };
}

export const userSettings = new Store(Strings.localUserSettings, {
  ...defaultSettings()
});

userSettings.upgrade(
  (data) => {
    if (!data || !data.theme) {
      return data;
    }

    if (data.theme.hasOwnProperty('value')) {
      return data;
    }
    // Move value to new prop.
    data.theme.value = data.theme.class;
    return data;
  },
  (data) => ({ ...defaultSettings(), ...data })
);
