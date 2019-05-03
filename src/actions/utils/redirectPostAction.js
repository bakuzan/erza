import { history as Navigate } from '../../index';
import Paths from 'constants/paths';
import Enums from 'constants/enums';

export default function redirectPostAction(type, lastLocation) {
  const baseUrl = `${Paths.base}${Paths[type].list}`;

  if (window.location.href.includes(`${type}-list`)) {
    return Navigate.push(
      `${baseUrl}${window.location.href.replace(/^.*\//g, '')}`
    );
  }

  const hasPrev = lastLocation && lastLocation.location;
  const targetUrl = hasPrev
    ? lastLocation.location.pathname
    : `${baseUrl}${Enums.status.Ongoing}`;

  return Navigate.push(targetUrl);
}
