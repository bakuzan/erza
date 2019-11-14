import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import classNames from 'classnames';
import { Helmet, HelmetProvider } from 'react-helmet-async';

import Toaster from 'meiko/Toaster';
import { useGlobalStyles } from 'meiko/hooks/useGlobalStyles';

import withLastLocation from 'components/withLastLocation';
import Header from 'components/Header';
import ScrollToTop from 'components/ScrollToTop';
import Shortcuts from 'components/Shortcuts';

import Alert from 'containers/Alert';
import RequestIndicator from 'containers/RequestIndicator';
import Sidebar from 'containers/Sidebar';

import './App.scss';

const App = ({ history, children, sidebarState }) => {
  useGlobalStyles();

  const appClasses = classNames('erza', {
    'sidebar-collapsed': sidebarState.isCollapsed,
    'sidebar-hidden': sidebarState.isHidden
  });

  return (
    <HelmetProvider>
      <ScrollToTop />
      <div className={appClasses}>
        <Helmet defaultTitle="Erza" titleTemplate="%s | Erza" />
        <Header />
        <Sidebar />
        <RequestIndicator />
        <main>{children}</main>
        <Alert />
        <Toaster />
        <Shortcuts history={history} />
      </div>
    </HelmetProvider>
  );
};

const mapStateToProps = (state) => ({
  sidebarState: state.sidebar
});

export default withRouter(connect(mapStateToProps)(withLastLocation(App)));
