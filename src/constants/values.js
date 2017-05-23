export const Enums = {
  anime: {
    status: {
      ongoing: 1,
      completed: 2,
      onhold: 3,
      dropped: 4,
      planned: 6,
      // all for status filter
      all: [1,2,3,4,6]
    },
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
  keyCode: {
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
  episode: 'episode',
  isAdult: 'is adult',
  isRepeat: 'is repeat',
  owned: 'owned',
  status: 'status',
  // directions
  ascending: 'ASC',
  descending: 'DESC',
  next: 'next',
  prev: 'prev',
  // page text
  create: 'Create',
  edit: 'Edit',
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
  // theme
  light: 'Light',
  dark: 'Dark',
  themes: [{ name: 'Light', class: 'theme-one' }, { name: 'Dark', class: 'theme-two' }]
}

export const Properties = {
  episode: 'episode',
  isAdult: 'isAdult',
  isRepeat: 'isRepeat',
  status: 'status'
}

export const Icons = {
  tick: '\u2713', //10003, //'\u2713',
  cross: '\u274C',
  pause: '\u23F8', //9208, //'\u23F8',
  clockwise: '\uD83D\uDD01', // 10227, //'\u27F3'
}

export const Types = {
  string: 'string'
}
