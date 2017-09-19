import {
  TOGGLE_SIDEBAR_VISIBILITY,
  TOGGLE_SIDEBAR_COLLAPSE,
  CLOSE_SIDEBAR
} from '../constants/actions'


export const toggleSidebarVisibility = () => ({ type: TOGGLE_SIDEBAR_VISIBILITY })

export const toggleSidebarCollapse = () => ({ type: TOGGLE_SIDEBAR_COLLAPSE })
export const closeSidebar = () => ({ type: CLOSE_SIDEBAR })
