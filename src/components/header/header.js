import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Header, SVGLogo } from 'meiko';

import AppSettings from 'containers/app-settings/app-settings';
import { Paths } from 'constants/paths';

class ErzaHeader extends Component {
  render() {
    return (
      <Header
        navLeft={
          <NavLink className="ripple" id="logo-svg" to={Paths.base}>
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
