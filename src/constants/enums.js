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
    All: Statuses,
    ...toKeyObj(Statuses)
  },
  seriesType: {
    Unknown: 'Unknown',
    anime: Object.freeze([
      'Unknown',
      'TV',
      'OVA',
      'Movie',
      'Special',
      'ONA',
      'Music'
    ]),
    manga: Object.freeze([
      'Unknown',
      'Manga',
      'Novel',
      'Oneshot',
      'Doujinshi',
      'Manhwa',
      'Manhua'
    ])
  }
});
