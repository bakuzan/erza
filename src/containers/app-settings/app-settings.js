import React, { PropTypes } from 'react'
import {connect} from 'react-redux'
import {setApplicationTheme} from '../../actions/theme'
import {Strings} from '../../constants/values'

const applyThemeToBody = theme => document.body.className = theme;

const AppSettings = ({ theme, setApplicationTheme }) => {
  const themes = Strings.themes.slice(0);
  applyThemeToBody(theme);
  return (
    <div id="app-settings">
      <button type="button"
              title="App settings"
              className="button-icon ripple"
              icon="&#x2699;">
      </button>
      <ul className="dropdown-menu" role="menu">
        <li className="dropdown-arrow"></li>
        <li className="button-group">
          {
            themes.map(item => (
              <button key={item.class}
                      type="button"
                      role="menuitem"
                      className="button"
                      onClick={() => setApplicationTheme(item.class)}
                >
                { item.name }
              </button>
            ))
          }
        </li>
      </ul>
    </div>
  );
}

AppSettings.propTypes = {
  theme: PropTypes.string.isRequired,
  setApplicationTheme: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({ theme: state.theme });
const mapDispatchToProps = ({ setApplicationTheme })

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AppSettings)
