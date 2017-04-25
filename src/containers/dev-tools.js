import React from 'react'
import { createDevTools } from 'redux-devtools'
import LogMonitor from 'redux-devtools-log-monitor'
import DockMonitor from 'redux-devtools-dock-monitor'
import MultipleMonitors from 'redux-devtools-multiple-monitors'
import DiffMonitor from 'redux-devtools-diff-monitor'
// import Dispatcher from 'redux-devtools-dispatch'

export default createDevTools(
  <DockMonitor
    toggleVisibilityKey="alt-h"
    changePositionKey="alt-m"
    defaultIsVisible={false}
  >
    <MultipleMonitors>
      <LogMonitor />
      <DiffMonitor />
    </MultipleMonitors>
  </DockMonitor>
)
//       <Dispatcher />
