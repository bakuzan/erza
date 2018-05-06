import { Constants } from 'meiko';

export default {
  ...Constants.Strings,
  localUserSettings: 'settingState',
  // labels
  start: 'start',
  end: 'end',
  episode: 'episode',
  chapter: 'chapter',
  isAdult: 'is adult',
  isRepeat: 'is repeat',
  owned: 'owned',
  status: 'status',
  season: 'season',
  timesCompleted: 'times revisited',
  // page text
  filters: {
    all: 'all',
    ongoing: 'ongoing',
    completed: 'completed',
    onhold: 'onhold',
    planned: 'planned'
  },
  anime: 'anime',
  manga: 'manga',
  history: 'history',
  deleteConfirmation: 'Are you sure you want to delete this entry?',
  // mal update messages
  fetchingMalEntry: 'fetching mal entry',
  noLinkedMalEntry: 'no related mal entry',
  failedMalUpdate: 'Failed to update mal entry',
  updatedMalEntry: 'updated mal values',
  malEntryUpToDate: 'mal already up to date',
  imgur: 'imgur',
  // theme
  light: 'Light',
  dark: 'Dark',
  themes: [...Constants.Strings.themes],
  // yoruichi filters
  timePeriod: {
    day: 'DAY',
    week: 'WEEK'
  }
};
