import React, { Component } from 'react';
import { connect } from 'react-redux';

import ElmWrapper from '../../components/elm-wrapper';
import { themes, DEFAULT_THEME } from './themes';

import Yoruichi from 'yoruichi-shunko';

function getTheme(key) {
  return themes.get(key) || DEFAULT_THEME;
}

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
      <div id="yoruichi" className="flex-column">
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
