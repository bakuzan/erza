import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import { SelectBox, Tickbox, DropdownMenu } from 'mko';

import { setApplicationTheme, toggleTimedTheme } from 'actions/theme';
import { toggleSidebarVisibility } from 'actions/sidebar';
import { toggleRequestIndicatorVisibility } from 'actions/requestIndicator';
import { toggleIsAdult } from 'actions/isAdult';
import { Strings } from 'constants/values';
import { Paths } from 'constants/paths';
import { getTimeoutMinutes } from 'utils';

import './AppSettings.scss';

let timedTheme;
const applyThemeToBody = (theme) => (document.body.className = theme);
const setTimedThemeCheck = (theme, updateTheme) => {
  const themes = Strings.themes.slice(0);
  fetch(Paths.sunrise_sunset)
    .then((response) => response.json())
    .then((json) => {
      let timedThemeShade;
      const { sunrise, sunset } = json.results;

      clearInterval(timedTheme);
      timedTheme = setInterval(() => {
        const start = new Date(sunrise).getTime();
        const end = new Date(sunset).getTime();
        const now = Date.now();
        timedThemeShade =
          start < now && now < end ? Strings.light : Strings.dark;
        const themeClass = themes.find((x) => x.name === timedThemeShade).class;
        if (theme !== themeClass) return updateTheme(themeClass);
      }, getTimeoutMinutes(5));
    })
    .catch((error) => console.error(error));
};

const themeMapper = (theme) => ({
  text: theme.name,
  value: theme.class
});
const appThemes = Strings.themes.map(themeMapper);

class AppSettings extends React.Component {
  constructor(props) {
    super(props);

    this.handleDropdownChange = this.handleDropdownChange.bind(this);
  }

  handleDropdownChange(onChange) {
    return (e) => {
      onChange(e.target.value);
    };
  }

  render() {
    const {
      theme,
      isTimed,
      setApplicationTheme,
      toggleTimedTheme,
      isAdult,
      toggleIsAdult,
      isSidebarHidden,
      toggleSidebarVisibility,
      isRequestIndicatorHidden,
      toggleRequestIndicatorVisibility
    } = this.props;
    applyThemeToBody(theme);
    if (isTimed) setTimedThemeCheck(theme, setApplicationTheme);

    return (
      <DropdownMenu id="app-settings" align="right">
        <li>
          <SelectBox
            id="appTheme"
            name="appTheme"
            text="App Theme"
            value={theme}
            options={appThemes}
            onChange={this.handleDropdownChange(setApplicationTheme)}
          />
        </li>
        <li>
          <Tickbox
            text="timed theme change"
            id="isTimed"
            name="isTimed"
            checked={isTimed}
            onChange={toggleTimedTheme}
          />
        </li>
        <li>
          <Tickbox
            text="toggle adult lists"
            id="isAdult"
            name="isAdult"
            checked={isAdult}
            onChange={toggleIsAdult}
          />
        </li>
        <li>
          <Tickbox
            text="toggle sidebar visibility"
            id="isSidebarHidden"
            name="isSidebarHidden"
            checked={!isSidebarHidden}
            onChange={toggleSidebarVisibility}
          />
        </li>
        <li>
          <Tickbox
            text="toggle request indicator visibility"
            id="isRequestIndicatorHidden"
            name="isRequestIndicatorHidden"
            checked={!isRequestIndicatorHidden}
            onChange={toggleRequestIndicatorVisibility}
          />
        </li>
      </DropdownMenu>
    );
  }
}

AppSettings.propTypes = {
  theme: PropTypes.string.isRequired,
  isTimed: PropTypes.bool.isRequired,
  setApplicationTheme: PropTypes.func.isRequired,
  toggleTimedTheme: PropTypes.func.isRequired,
  isAdult: PropTypes.bool.isRequired,
  toggleIsAdult: PropTypes.func.isRequired,
  isSidebarHidden: PropTypes.bool.isRequired,
  toggleSidebarVisibility: PropTypes.func.isRequired,
  isRequestIndicatorHidden: PropTypes.bool.isRequired,
  toggleRequestIndicatorVisibility: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  theme: state.theme.class,
  isTimed: state.theme.isTimed,
  isAdult: state.isAdult,
  isSidebarHidden: state.sidebar.isHidden,
  isRequestIndicatorHidden: state.requestIndicator.isHidden
});

const mapDispatchToProps = {
  setApplicationTheme,
  toggleTimedTheme,
  toggleIsAdult,
  toggleSidebarVisibility,
  toggleRequestIndicatorVisibility
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AppSettings);
