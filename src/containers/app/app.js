import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import classNames from 'classnames';

import withLastLocation from '../../components/last-location';
import Header from '../../components/header/header';
import Sidebar from '../sidebar/sidebar';
import RequestIndicator from '../request-indicator';
import Toaster from '../../components/toaster/toaster';
import Shortcuts from '../../components/shortcuts/shortcuts';
import Alert from '../alert';

import './app.css';

const App = ({ history, children, sidebarState }) => {
  const appClasses = classNames('erza', {
    'sidebar-collapsed': sidebarState.isCollapsed,
    'sidebar-hidden': sidebarState.isHidden
  });

  return (
    <div className={appClasses}>
      <Header />
      <Sidebar />
      <RequestIndicator />
      <main>{children}</main>
      <Alert />
      <Toaster />
      <Shortcuts history={history} />
    </div>
  );
};

const mapStateToProps = state => ({
  sidebarState: state.sidebar
});

export default withRouter(connect(mapStateToProps)(withLastLocation(App)));
