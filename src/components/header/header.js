import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Header } from 'meiko';

import AppSettings from 'containers/app-settings/app-settings';

import { Paths } from '../../constants/paths';

class ErzaHeader extends Component {
  render() {
    return (
      <Header
        navLeft={
          <Link className="ripple" id="logo-svg" to={Paths.base}>
            {/* <SVGLogo text="Erza" /> */}
          </Link>
        }
        title="ERZA"
        navRight={<AppSettings />}
      />
    );
  }
}

export default ErzaHeader;
