import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet-async';

import ElmWrapper from 'components/ElmWrapper';
import getTheme from 'constants/elmThemes';

import Yoruichi from 'yoruichi-shunko';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      theme: getTheme(this.props.themeClass)
    };

    this.setupPorts = this.setupPorts.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.themeClass !== this.props.themeClass) {
      this.ports.theme.send(getTheme(this.props.themeClass));
    }
  }

  setupPorts(ports) {
    this.ports = ports;
  }

  render() {
    const flags = {
      ...this.state
    };

    return (
      <div id="yoruichi" className="flex flex--column">
        <Helmet>
          <title>Home</title>
        </Helmet>
        <ElmWrapper
          src={Yoruichi.Elm.Main}
          flags={flags}
          ports={this.setupPorts}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  themeClass: state.theme ? state.theme.class : null
});

export default connect(mapStateToProps)(Home);
