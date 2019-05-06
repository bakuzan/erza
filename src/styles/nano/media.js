function mq(key) {
  return (o) => ({
    [key]: {
      ...o
    }
  });
}

const screen_xs = 480;
const screen_sm = 768;
const screen_md = 992;
const screen_lg = 1200;

// Prevent overlapping
const screen_xxs_max = screen_xs - 1;
const screen_xs_max = screen_sm - 1;
const screen_sm_max = screen_md - 1;
const screen_md_max = screen_lg - 1;

export default new Map([
  ['lg', mq(`@media (min-width: ${screen_lg}px)`)],
  [
    'md',
    mq(`@media (min-width: ${screen_md}px) and (max-width: ${screen_md_max}px)`)
  ],
  [
    'sm',
    mq(`@media (min-width: ${screen_sm}px) and (max-width: ${screen_sm_max}px)`)
  ],
  [
    'xs',
    mq(`@media (min-width: ${screen_xs}px) and (max-width: ${screen_xs_max}px)`)
  ],
  ['xxs', mq(`@media (max-width: ${screen_xxs_max}px)`)]
]);
