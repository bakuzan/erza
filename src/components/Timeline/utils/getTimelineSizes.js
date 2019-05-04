import { DATE_BUTTON_BASE_SIZE, ARROW_BUTTON_SIZE } from './consts';

export default function getTimelineSizes(width) {
  const timelineSpace = width - 2 * ARROW_BUTTON_SIZE;
  const parts = Math.floor(timelineSpace / DATE_BUTTON_BASE_SIZE) - 1;
  return { timelineSpace, buttonSize: width / parts, parts };
}
