import React, { Component } from 'react';
import SvgLogo from '../svg-logo/svg-logo.js';
import AppSettings from '../../containers/app-settings/app-settings';
import { Link } from 'react-router-dom';
import { Paths } from '../../constants/paths';
import './header.css';
import '../../styles/ripple.css';
import '../../styles/box-model.css';

class Header extends Component {
  render() {
    return (
      <nav className="application-header">
        <Link className="ripple" id="logo-svg" to={Paths.base}>
          <SvgLogo text="Erza" />
        </Link>
        <div className="flex-spacer" />
        <h1>ERZA</h1>
        <div className="flex-spacer" />
        <div id="navigation-links">
          <AppSettings />
        </div>
      </nav>
    );
  }
}

export default Header;
