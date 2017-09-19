import React from 'react';
import { connect } from 'react-redux'
import classNames from 'classnames'

import Header from '../../components/header/header';
import Sidebar from '../sidebar/sidebar'
import Toaster from '../../components/toaster/toaster';
import Shortcuts from '../../components/shortcuts/shortcuts';
import './app.css';

const App = ({ params, children, sidebarState }) => {
  const appClasses = classNames("erza", { 
    "sidebar-collapsed": sidebarState.isCollapsed, 
    "sidebar-hidden": sidebarState.isHidden
  })
  
  return (
    <div className={appClasses}>
      <Header />
      <Sidebar />
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


export default connect(
  mapStateToProps
)(App);
