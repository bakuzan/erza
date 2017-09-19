import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import classNames from 'classnames'

import { toggleSidebar } from '../../actions/sidebar'
import { Icons } from '../../constants/values'

import "./Sidebar.css"


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
  toggleCollapse: toggleSidebar
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Sidebar)
