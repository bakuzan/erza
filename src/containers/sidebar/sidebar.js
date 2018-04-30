import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { withRouter, NavLink } from 'react-router-dom';

import { Sidebar } from 'meiko';
import { toggleSidebarCollapse, closeSidebar } from '../../actions/sidebar';
import Menu from '../../constants/menu';

const menuOptions = Menu.reduce((p, c) => p.concat(c.children), Array(0));

const isSidebarActive = targetPath => (match, { pathname }) => {
  if (!targetPath || !targetPath.includes('list')) return !!match;
  return targetPath.slice(0, 17) === pathname.slice(0, 17);
};

const SidebarConnected = ({ location, ...props }) => {
  return (
    <Sidebar
      {...props}
      items={menuOptions}
      customLinkTemplate={option => (
        <li key={option.id} className="sidebar-item" title={option.title}>
          <NavLink
            className="button primary"
            activeClassName="active"
            to={option.link}
            onClick={props.close}
            isActive={isSidebarActive(option.link)}
          >
            <div className="sidebar-item-icon center-contents">
              {option.icon}
            </div>
            <div className="sidebar-item-text">{option.title}</div>
          </NavLink>
        </li>
      )}
    />
  );
};

Sidebar.propTypes = {
  isHidden: PropTypes.bool.isRequired,
  isCollapsed: PropTypes.bool.isRequired,
  toggleCollapse: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  isHidden: state.sidebar.isHidden,
  isCollapsed: state.sidebar.isCollapsed
});

const mapDispatchToProps = {
  toggleCollapse: toggleSidebarCollapse,
  close: closeSidebar
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Sidebar)
);
