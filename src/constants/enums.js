import { KeyCodes } from 'mko';

function toKeyObj(arr) {
  return arr.reduce((p, k) => ({ ...p, [k]: k }), {});
}

const Statuses = Object.freeze([
  'Ongoing',
  'Completed',
  'Onhold',
  'Dropped',
  'Planned'
]);

export default Object.freeze({
  KeyCodes,
  status: {
    ...toKeyObj(Statuses),
    All: Statuses
  }
  // animeType: toKeyObj([
  //   'Unknown',
  //   'TV',
  //   'OVA',
  //   'Movie',
  //   'Special',
  //   'ONA',
  //   'Music'
  // ]),
  // mangaType: toKeyObj([
  //   'Unknown',
  //   'Manga',
  //   'Novel',
  //   'Oneshot',
  //   'Doujinshi',
  //   'Manhwa',
  //   'Manhua'
  // ])
});
