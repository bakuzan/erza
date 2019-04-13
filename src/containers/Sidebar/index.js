import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { Sidebar } from 'mko';
import SidebarItem from './SidebarItem';
import { toggleSidebarCollapse, closeSidebar } from 'actions/sidebar';
import Menu from 'constants/menu';

const menuOptions = Menu.reduce((p, c) => p.concat(c.children), Array(0));

const SidebarConnected = ({ location, staticContext, ...props }) => {
  console.log('SIDEBAR PROP?', staticContext);
  return (
    <Sidebar
      {...props}
      id="erza-sidebar"
      items={menuOptions}
      customLinkTemplate={SidebarItem}
    />
  );
};

Sidebar.propTypes = {
  isHidden: PropTypes.bool.isRequired,
  isCollapsed: PropTypes.bool.isRequired,
  toggleCollapse: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  isHidden: state.sidebar.isHidden,
  isCollapsed: state.sidebar.isCollapsed
});

const mapDispatchToProps = {
  toggleCollapse: toggleSidebarCollapse,
  close: closeSidebar
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(SidebarConnected)
);
