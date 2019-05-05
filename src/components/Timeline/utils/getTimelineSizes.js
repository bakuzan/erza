import { ARROW_BUTTON_SIZE } from './consts';

/** TODO
 *  Implement zoom feature
 *  Until then hard coded view to a single month
 */

export default function getTimelineSizes(width) {
  const timelineSpace = width - 2 * ARROW_BUTTON_SIZE;
  // const parts = Math.floor(timelineSpace / DATE_BUTTON_BASE_SIZE) - 1;
  const parts = 0;
  return { timelineSpace, buttonSize: width / parts, parts };
}
