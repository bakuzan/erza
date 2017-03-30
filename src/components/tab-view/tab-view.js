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
  name: React.PropTypes.string.isRequired,
  isActive: React.PropTypes.bool,
  children: React.PropTypes.oneOfType([
    React.PropTypes.element,
    React.PropTypes.arrayOf(React.PropTypes.element)
  ]).isRequired
};

export default TabView
