import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { withRouter, NavLink } from 'react-router-dom';
import classNames from 'classnames';

import { toggleSidebarCollapse, closeSidebar } from '../../actions/sidebar';
import Menu from '../../constants/menu';
import { Icons } from '../../constants/values';

import './sidebar.css';

const menuOptions = Menu.reduce((p, c) => p.concat(c.children), Array(0));

const isSidebarActive = targetPath => (match, { pathname }) => {
  if (!targetPath.includes('list')) return !!match;
  return targetPath.slice(0, 17) === pathname.slice(0, 17);
};

const Sidebar = ({
  isHidden,
  isCollapsed,
  toggleCollapse,
  close,
  location
}) => {
  const sidebarClasses = classNames({
    collapsed: isCollapsed,
    hidden: isHidden
  });

  return (
    <div id="sidebar" className={sidebarClasses}>
      <button
        type="button"
        id="sidebar-toggler"
        className="button button-icon primary"
        icon={isCollapsed ? Icons.right : Icons.left}
        onClick={toggleCollapse}
      />
      <ul id="sidebar-menu">
        {menuOptions.map(option => (
          <li key={option.id} className="sidebar-item" title={option.title}>
            <NavLink
              className="button primary"
              activeClassName="active"
              to={option.link}
              onClick={close}
              isActive={isSidebarActive(option.link)}
            >
              <div className="sidebar-item-icon center-contents">
                {option.icon}
              </div>
              <div className="sidebar-item-text">{option.title}</div>
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
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
