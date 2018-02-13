import {
  TOGGLE_SIDEBAR_VISIBILITY,
  TOGGLE_SIDEBAR_COLLAPSE,
  CLOSE_SIDEBAR
} from '../constants/actions';
import { getUserSettings, persistUserSettings } from '../utils/common';
import { createReducer } from './utils';

const getUserSidebar = () => {
  const settings = getUserSettings();
  if (!settings || !settings.sidebar)
    return { isHidden: false, isCollapsed: false };
  return settings.sidebar;
};

const persistSidebarVisibility = (state, action) => {
  const updatedSettings = persistUserSettings({
    sidebar: { ...state, isHidden: !state.isHidden }
  });
  return updatedSettings.sidebar;
};

const persistSidebarCollapse = status => (state, action) => {
  const isCollapsed = status || !state.isCollapsed;
  const updatedSettings = persistUserSettings({
    sidebar: { ...state, isCollapsed }
  });
  return updatedSettings.sidebar;
};

export const sidebar = createReducer(getUserSidebar(), {
  [TOGGLE_SIDEBAR_VISIBILITY]: persistSidebarVisibility,
  [TOGGLE_SIDEBAR_COLLAPSE]: persistSidebarCollapse(),
  [CLOSE_SIDEBAR]: persistSidebarCollapse(true)
});
