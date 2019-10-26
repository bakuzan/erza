import React from 'react';
import { NavLink } from 'react-router-dom';

import Header from 'meiko/Header';
import SVGLogo from 'meiko/Logo';
import AppSettings from 'containers/AppSettings';
import Paths from 'constants/paths';

import './Header.scss';

function ErzaHeader() {
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

export default ErzaHeader;
