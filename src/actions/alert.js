import { curry, generateUniqueId } from 'utils';

const DEFAULT = 'default';
const ERROR = 'error';

export const ALERT_MESSAGE = 'ALERT_MESSAGE';
export const showAlertMessage = (alertType = DEFAULT, alert) => ({
  type: ALERT_MESSAGE,
  alert: {
    id: generateUniqueId(),
    type: alertType,
    ...alert
  }
});

export const showAlertError = curry(showAlertMessage, ERROR);

export const ALERT_DISMISS = 'ALERT_DISMISS';
export const dismissAlertMessage = (alertId) => ({
  type: ALERT_DISMISS,
  alertId
});
