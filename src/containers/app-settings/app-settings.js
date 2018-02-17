import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import Tickbox from '../../components/tickbox/tickbox';
import { setApplicationTheme, toggleTimedTheme } from '../../actions/theme';
import { toggleSidebarVisibility } from '../../actions/sidebar';
import { toggleRequestIndicatorVisibility } from '../../actions/request-indicator';
import { toggleIsAdult } from '../../actions/is-adult';
import { Strings } from '../../constants/values';
import { Paths } from '../../constants/paths';
import { getTimeoutMinutes } from '../../utils/common';

let timedTheme;
const applyThemeToBody = theme => (document.body.className = theme);
const setTimedThemeCheck = (theme, updateTheme) => {
  const themes = Strings.themes.slice(0);
  fetch(Paths.sunrise_sunset)
    .then(response => response.json())
    .then(json => {
      let timedThemeShade;
      const { sunrise, sunset } = json.results;

      clearInterval(timedTheme);
      timedTheme = setInterval(() => {
        const start = new Date(sunrise).getTime();
        const end = new Date(sunset).getTime();
        const now = Date.now();
        timedThemeShade =
          start < now && now < end ? Strings.light : Strings.dark;
        const themeClass = themes.find(x => x.name === timedThemeShade).class;
        if (theme !== themeClass) return updateTheme(themeClass);
      }, getTimeoutMinutes(5));
    })
    .catch(error => console.error(error));
};

const AppSettings = ({
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
}) => {
  const themes = Strings.themes.slice(0);
  applyThemeToBody(theme);
  if (isTimed) setTimedThemeCheck(theme, setApplicationTheme);

  return (
    <div id="app-settings">
      <button
        type="button"
        title="App settings"
        className="button-icon ripple"
        icon="&#x2699;"
      />
      <ul className="dropdown-menu" role="menu">
        <li className="dropdown-arrow" />
        <li className="button-group">
          {themes.map(item => (
            <button
              key={item.class}
              type="button"
              role="menuitem"
              className="button"
              onClick={() => setApplicationTheme(item.class)}
            >
              {item.name}
            </button>
          ))}
        </li>
        <li>
          <Tickbox
            text="timed theme change"
            name="isTimed"
            checked={isTimed}
            onChange={() => toggleTimedTheme()}
          />
        </li>
        <li>
          <Tickbox
            text="toggle adult lists"
            name="isAdult"
            checked={isAdult}
            onChange={() => toggleIsAdult()}
          />
        </li>
        <li>
          <Tickbox
            text="toggle sidebar visibility"
            name="isSidebarHidden"
            checked={!isSidebarHidden}
            onChange={() => toggleSidebarVisibility()}
          />
        </li>
        <li>
          <Tickbox
            text="toggle request indicator visibility"
            name="isRequestIndicatorHidden"
            checked={!isRequestIndicatorHidden}
            onChange={() => toggleRequestIndicatorVisibility()}
          />
        </li>
      </ul>
    </div>
  );
};

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

const mapStateToProps = state => ({
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

export default connect(mapStateToProps, mapDispatchToProps)(AppSettings);
