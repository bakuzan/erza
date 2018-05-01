import React from 'react';
import { NavLink } from 'react-router-dom';

const isSidebarActive = targetPath => (match, { pathname }) => {
  if (!targetPath || !targetPath.includes('list')) return !!match;
  return targetPath.slice(0, 17) === pathname.slice(0, 17);
};

const SidebarItem = ({ data, close }) => (
  <NavLink
    className="button primary"
    activeClassName="active"
    to={data.link}
    onClick={close}
    isActive={isSidebarActive(data.link)}
  >
    <div className="sidebar-item-icon center-contents">{data.icon}</div>
    <div className="sidebar-item-text">{data.title}</div>
  </NavLink>
);

export default SidebarItem;
