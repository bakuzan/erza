import React from 'react';
import { NavLink } from 'react-router-dom';

import './SidebarItem.scss';

const isSidebarActive = (targetPath) => (match, { pathname }) => {
  if (!targetPath || !targetPath.includes('list')) {
    return !!match;
  }

  return targetPath.slice(0, 17) === pathname.slice(0, 17);
};

const SidebarItem = ({ data, onClick }) => (
  <NavLink
    className="sidebar-item__link"
    activeClassName="active"
    to={data.link}
    onClick={onClick}
    isActive={isSidebarActive(data.link)}
  >
    <div className="sidebar-item__link-icon center-contents">{data.icon}</div>
    <div className="sidebar-item__link-text">{data.title}</div>
  </NavLink>
);

export default SidebarItem;
