import React from 'react';
import { connect } from 'react-redux'
import { withRouter, Redirect } from 'react-router'
import classNames from 'classnames'

import Header from '../../components/header/header';
import Sidebar from '../sidebar/sidebar'
import RequestIndicator from '../request-indicator'
import Toaster from '../../components/toaster/toaster';
import Shortcuts from '../../components/shortcuts/shortcuts';
import {Paths} from '../../constants/paths'
import './app.css';

const App = ({ match, children, sidebarState }) => {
  const appClasses = classNames("erza", {
    "sidebar-collapsed": sidebarState.isCollapsed,
    "sidebar-hidden": sidebarState.isHidden
  })

  if (match.isExact && match.url === "/") return <Redirect to={Paths.base} />

  return (
    <div className={appClasses}>
      <Header />
      <Sidebar />
      <RequestIndicator />
      <main>
      { children }
      </main>
      <Toaster />
      <Shortcuts />
    </div>
  )
}

const mapStateToProps = state => ({
  sidebarState: state.sidebar
})


export default withRouter(
  connect(
    mapStateToProps
  )(App)
);
