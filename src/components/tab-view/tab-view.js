import PropTypes from 'prop-types';
import React from 'react'

const TabView = ({ isActive, children }) => (
  <div className={`tab-view${isActive ? ' active' : ''}`} role="tabpanel">
  { children }
  </div>
)

TabView.defaultProps = {
  isActive: false
};

TabView.propTypes = {
  name: PropTypes.string.isRequired,
  isActive: PropTypes.bool,
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element)
  ]).isRequired
};

export default TabView
