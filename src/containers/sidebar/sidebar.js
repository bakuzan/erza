import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import classNames from 'classnames'

import { toggleSidebarCollapse } from '../../actions/sidebar'
import Menu from '../../constants/menu'
import { Icons } from '../../constants/values'

import "./Sidebar.css"

const menuOptions = Menu.reduce((p, c) => p.concat(c.children), Array(0))

const Sidebar = ({ isHidden, isCollapsed, toggleCollapse }) => {
  const sidebarClasses = classNames({ "collapsed": isCollapsed, "hidden": isHidden })

  return (
    <div id="sidebar" className={sidebarClasses}>
      <button 
        type="button" 
        id="sidebar-toggler"
        className="button button-icon primary" 
        icon={isCollapsed ? Icons.right : Icons.left} 
        onClick={toggleCollapse}>
      </button>
      <ul id="sidebar-menu">
      {
          menuOptions.map(option => (
            <li key={option.id} className="sidebar-item" title={option.title}>
              <Link className="button primary" to={option.link}>
                <div className="sidebar-item-icon center-contents">
                  { option.icon }
                </div>
                <div className="sidebar-item-text">
                  { option.title }
                </div>
              </Link>
            </li>
          ))
      }
      </ul>
    </div>
  )
}


Sidebar.propTypes = {
  isHidden: PropTypes.bool.isRequired,
  isCollapsed: PropTypes.bool.isRequired,
  toggleCollapse: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
  isHidden: state.sidebar.isHidden,
  isCollapsed: state.sidebar.isCollapsed
})

const mapDispatchToProps = {
  toggleCollapse: toggleSidebarCollapse
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Sidebar)
