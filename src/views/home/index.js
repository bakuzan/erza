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
      theme: getTheme(this.props.themeValue)
    };

    this.setupPorts = this.setupPorts.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.themeValue !== this.props.themeValue) {
      this.ports.theme.send(getTheme(this.props.themeValue));
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
        <ElmWrapper src={Yoruichi} flags={flags} ports={this.setupPorts} />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  themeValue: state.theme ? state.theme.value : null
});

export default connect(mapStateToProps)(Home);
