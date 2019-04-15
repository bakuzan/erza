import { KeyCodes } from 'mko';

export default {
  KeyCodes,
  status: {
    ongoing: 1,
    completed: 2,
    onhold: 3,
    dropped: 4,
    planned: 6,
    // all for status filter
    all: [1, 2, 3, 4, 6]
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
  }
};
