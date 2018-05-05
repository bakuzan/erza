import React from 'react';
import { ButtonisedNavLink } from 'components/buttonised';
import './sidebar-item.css';

const isSidebarActive = targetPath => (match, { pathname }) => {
  if (!targetPath || !targetPath.includes('list')) return !!match;
  return targetPath.slice(0, 17) === pathname.slice(0, 17);
};

const SidebarItem = ({ data, close }) => (
  <ButtonisedNavLink
    className="sidebar-item"
    btnStyle="primary"
    activeClassName="active"
    to={data.link}
    onClick={close}
    isActive={isSidebarActive(data.link)}
  >
    <div className="sidebar-item-icon center-contents">{data.icon}</div>
    <div className="sidebar-item-text">{data.title}</div>
  </ButtonisedNavLink>
);

export default SidebarItem;
