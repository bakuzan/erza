import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import DropdownMenu from 'meiko/DropdownMenu';
import SelectBox from 'meiko/SelectBox';
import Tickbox from 'meiko/Tickbox';

import { setApplicationTheme, toggleTimedTheme } from 'actions/theme';
import { toggleSidebarVisibility } from 'actions/sidebar';
import { toggleRequestIndicatorVisibility } from 'actions/requestIndicator';
import { toggleIsAdult } from 'actions/isAdult';
import { Strings } from 'constants/values';
import Paths from 'constants/paths';
import { getTimeoutMinutes } from 'utils';

import './AppSettings.scss';

let timedTheme;
const applyThemeToBody = (theme) =>
  (document.body.className = `theme theme--${theme}`);

async function setTimedThemeCheck(theme, updateTheme) {
  const themes = Strings.themes.slice(0);

  const response = await fetch(Paths.sunrise_sunset);
  const json = await response.json();

  let timedThemeShade;
  const { sunrise, sunset } = json.results;

  clearInterval(timedTheme);
  timedTheme = setInterval(() => {
    const start = new Date(sunrise).getTime();
    const end = new Date(sunset).getTime();
    const now = Date.now();
    timedThemeShade = start < now && now < end ? Strings.light : Strings.dark;

    const themeClass = themes.find((x) => x.name === timedThemeShade).value;

    if (theme !== themeClass) {
      return updateTheme(themeClass);
    }
  }, getTimeoutMinutes(5));
}

const themeMapper = (theme) => ({
  text: theme.name,
  value: theme.value
});
const appThemes = Strings.themes.map(themeMapper);

function AppSettings({
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
}) {
  useEffect(() => {
    applyThemeToBody(theme);

    if (isTimed) {
      setTimedThemeCheck(theme, setApplicationTheme);
    }
  });

  return (
    <DropdownMenu id="app-settings" className="app-settings" align="right">
      <li>
        <SelectBox
          id="appTheme"
          name="appTheme"
          text="App Theme"
          value={theme}
          options={appThemes}
          onChange={(e) => {
            setApplicationTheme(e.target.value);
          }}
        />
      </li>
      <li>
        <Tickbox
          text="timed theme change"
          id="isTimed"
          containerClassName="app-settings__tickbox"
          name="isTimed"
          checked={isTimed}
          onChange={toggleTimedTheme}
        />
      </li>
      <li>
        <Tickbox
          text="toggle adult lists"
          id="isAdult"
          containerClassName="app-settings__tickbox"
          name="isAdult"
          checked={isAdult}
          onChange={toggleIsAdult}
        />
      </li>
      <li>
        <Tickbox
          text="toggle sidebar visibility"
          id="isSidebarHidden"
          containerClassName="app-settings__tickbox"
          name="isSidebarHidden"
          checked={!isSidebarHidden}
          onChange={toggleSidebarVisibility}
        />
      </li>
      <li>
        <Tickbox
          text="toggle request indicator visibility"
          id="isRequestIndicatorHidden"
          containerClassName="app-settings__tickbox"
          name="isRequestIndicatorHidden"
          checked={!isRequestIndicatorHidden}
          onChange={toggleRequestIndicatorVisibility}
        />
      </li>
    </DropdownMenu>
  );
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
  theme: state.theme.value,
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
