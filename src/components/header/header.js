import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Header, SVGLogo } from 'meiko';

import AppSettings from 'containers/app-settings/app-settings';
import { Paths } from 'constants/paths';

import './header.scss';

class ErzaHeader extends Component {
  render() {
    return (
      <Header
        id="erza-header"
        navLeft={
          <NavLink className="ripple erza-svg" id="logo-svg" to={Paths.base}>
            <SVGLogo text="Erza" />
          </NavLink>
        }
        title="ERZA"
        navRight={<AppSettings />}
      />
    );
  }
}

export default ErzaHeader;
