import React, { Component } from 'react';
import SvgLogo from '../svg-logo/svg-logo.js';
import { Link } from 'react-router';
import { Paths } from '../../constants/paths';
import './header.css';
import '../../styles/ripple.css';
import '../../styles/box-model.css';

// <Link className="ripple center-contents"
//       activeClassName="active"
//       to={`${paths.base}${paths.statistics}`}>
//   Statistics
// </Link>

class Header extends Component {
  render() {
    return (
      <nav className="application-header center-contents">
        <Link className="ripple" id="logo-svg" to={Paths.base}>
          <SvgLogo text="Erza" />
        </Link>
        <h1>ERZA</h1>
        <div id="navigation-links">
          <div className="flex-right">
          </div>
        </div>
      </nav>
    );
  }
}

export default Header;
