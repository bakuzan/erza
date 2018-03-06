import { ALERT_MESSAGE, ALERT_DISMISS } from '../actions/alert';
import { createReducer } from './utils';

const initialState = {
  alerts: []
};

function pushAlert(state, action) {
  return { ...state, alerts: [action.alert] };
}

function dismissAlert(state, action) {
  return {
    ...state,
    alerts: state.alerts.filter(m => m.id !== action.alertId)
  };
}

const alert = createReducer(initialState, {
  [ALERT_MESSAGE]: pushAlert,
  [ALERT_DISMISS]: dismissAlert
});

export default alert;
