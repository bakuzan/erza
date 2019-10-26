import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import Sidebar from 'meiko/Sidebar';
import SidebarItem from './SidebarItem';
import { toggleSidebarCollapse, closeSidebar } from 'actions/sidebar';
import Menu from 'constants/menu';

const menuOptions = Menu.reduce((p, c) => p.concat(c.children), Array(0));

const SidebarConnected = ({ toggleCollapse, close, isHidden, isCollapsed }) => {
  const passProps = { toggleCollapse, close, isHidden, isCollapsed };
  return (
    <Sidebar
      {...passProps}
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
