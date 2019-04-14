import {
  TOGGLE_SIDEBAR_VISIBILITY,
  TOGGLE_SIDEBAR_COLLAPSE,
  CLOSE_SIDEBAR
} from '../constants/actions';
import { userSettings } from '../utils/storage';
import { createReducer } from './utils';

function getUserSidebar() {
  const settings = userSettings.get();
  if (!settings || !settings.sidebar) {
    return { isHidden: false, isCollapsed: false };
  }
  return settings.sidebar;
}

function persistSidebarVisibility(state) {
  const updatedSettings = userSettings.set({
    sidebar: { ...state, isHidden: !state.isHidden }
  });
  return updatedSettings.sidebar;
}

const persistSidebarCollapse = (status) => (state) => {
  const isCollapsed = status || !state.isCollapsed;
  const updatedSettings = userSettings.set({
    sidebar: { ...state, isCollapsed }
  });
  return updatedSettings.sidebar;
};

export const sidebar = createReducer(getUserSidebar(), {
  [TOGGLE_SIDEBAR_VISIBILITY]: persistSidebarVisibility,
  [TOGGLE_SIDEBAR_COLLAPSE]: persistSidebarCollapse(),
  [CLOSE_SIDEBAR]: persistSidebarCollapse(true)
});
