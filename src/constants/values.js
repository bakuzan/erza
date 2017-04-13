export const Enums = {
  anime: {
    status: {
      ongoing: 1,
      completed: 2,
      onhold: 3,
      dropped: 4,
      planned: 6
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
  // page text
  create: 'Create',
  edit: 'Edit',
  back: 'Back',
  cancel: 'cancel',
  filters: {
    all: 'all',
    ongoing: 'ongoing',
    completed: 'completed'
  },
  anime: 'anime',
  manga: 'manga',
  monthNames: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  themes: [{ name: 'Light', class: 'theme-one' }, { name: 'Dark', class: 'theme-two' }]
}

export const Properties = {
  episode: 'episode',
  isAdult: 'isAdult',
  isRepeat: 'isRepeat'
}

export const Icons = {
  tick: '\u2713',
  cross: '\u274C'
}
