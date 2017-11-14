export const Enums = {
  status: {
    ongoing: 1,
    completed: 2,
    onhold: 3,
    dropped: 4,
    planned: 6,
    // all for status filter
    all: [1,2,3,4,6],
  },
  anime: {
    type: {
      unknown: 0,
      tv: 1,
      ova: 2,
      movie: 3,
      special: 4,
      ona: 5,
      music: 6
    }
  },
  manga: {
    type: {
      unknown: 0,
      manga: 1,
      novel: 2,
      oneshot: 3,
      doujinshi: 4,
      manhwa: 5,
      manhua: 6
    }
  },
  keyCode: {
    q: 81,
    backspace: 8,
    enter: 13,
    up: 38,
    down: 40
  }
}

export const Strings = {
  localUserSettings: 'settingState',
  // inputs
  checkbox: 'checkbox',
  selectbox: 'select-one',
  date: 'date',
  text: 'text',
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
  // directions
  ascending: 'ASC',
  descending: 'DESC',
  next: 'next',
  prev: 'prev',
  // page text
  loading: 'loading',
  success: 'success',
  error: 'error',
  unfinished: 'Unfinished',
  noItemsAvailable: 'No items were found.',
  create: 'Create',
  edit: 'Edit',
  delete: 'Delete',
  back: 'Back',
  cancel: 'cancel',
  filters: {
    all: 'all',
    ongoing: 'ongoing',
    completed: 'completed',
    onhold: 'onhold'
  },
  anime: 'anime',
  manga: 'manga',
  history: 'history',
  monthNames: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  deleteConfirmation: 'Are you sure you want to delete this entry?',
  // mal update messages
  fetchingMalEntry: 'fetching mal entry',
  noLinkedMalEntry: 'no related mal entry',
  updatedMalEntry: 'updated mal values',
  malEntryUpToDate: 'mal already up to date',
  imgur: "imgur",
  // theme
  light: 'Light',
  dark: 'Dark',
  themes: [{ name: 'Light', class: 'theme-one' }, { name: 'Dark', class: 'theme-two' }],
  // yoruichi filters
  timePeriod: {
    day: "DAY",
    week: "WEEK"
  }
}

export const Properties = {
  episode: 'episode',
  seriesEpisodes: 'series_episodes',
  isAdult: 'isAdult',
  isRepeat: 'isRepeat',
  status: 'status',
  season: 'season',
  tagList: 'tagList',
  chapter: 'chapter',
  seriesChapters: 'series_chapters',
  dayOfWeek: 'dayOfWeek'
}

export const NonPostableProperties = [
  Properties.season,
  Properties.tagList,
  Properties.dayOfWeek
];

export const Icons = {
  tick: '\u2713', //10003, //'\u2713',
  cross: '\u2573', //'\u274C',
  pause: '\u2223\u2223', //'\u23F8', //9208, //'\u23F8',
  clockwise: '\uD83D\uDD01', // 10227, //'\u27F3'
  link: '\uD83D\uDD17',
  editable: '\u270E', //'\uD83D\uDD89',
  save: '\uD83D\uDCBE',
  left: '\u2039',
  right: '\u203A',
}

export const Types = {
  string: 'string',
  object: 'object',
  boolean: 'boolean',
  number: 'number'
}

export const Days = [
  "Sun",
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat"
]

export const ImageUrls = {
  deadImage: "https://i.imgur.com/gKr1YhF.png"
}

export const pageSizes = {
  default: [5, 10, 15, 25],
  history: [25, 50, 75, 100]
}
