import Store from 'ayaka/localStorage';

import { Strings } from 'constants/values';

export const userSettings = new Store(Strings.localUserSettings, {});
userSettings.upgrade((data) => {
  if (!data || !data.theme) {
    return data;
  }

  if (data.theme.hasOwnProperty('value')) {
    return data;
  }
  // Move value to new prop.
  data.theme.value = data.theme.class;
  return data;
});
