import React from 'react';
import { ButtonisedNavButton } from 'components/buttonised';
import './sidebar-item.css';

const isSidebarActive = targetPath => (match, { pathname }) => {
  if (!targetPath || !targetPath.includes('list')) return !!match;
  return targetPath.slice(0, 17) === pathname.slice(0, 17);
};

const SidebarItem = ({ data, close }) => (
  <ButtonisedNavButton
    className="sidebar-item"
    btnStyle="primary"
    activeClassName="active"
    to={data.link}
    onClick={close}
    isActive={isSidebarActive(data.link)}
  >
    <div className="sidebar-item-icon center-contents">{data.icon}</div>
    <div className="sidebar-item-text">{data.title}</div>
  </ButtonisedNavButton>
);

export default SidebarItem;