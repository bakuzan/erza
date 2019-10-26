import { ARROW_BUTTON_SIZE } from './consts';

export default function getTimelineSizes(width, monthCount = 1) {
  const timelineSpace = width - 2 * ARROW_BUTTON_SIZE;
  const parts = monthCount - 1;

  return { timelineSpace, buttonSize: width / monthCount, parts };
}
