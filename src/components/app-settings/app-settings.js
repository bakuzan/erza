import React, { Component } from 'react'

class AppSettings extends Component {
  
  constructor() {
    super();
    
    this.themes = [
      { name: 'Light', class: 'theme-one' },
      { name: 'Dark', class: 'theme-two' }
    ];
    this.default = {
      theme: this.themes[1].class
    }
  }
  
  componentDidMount() {
    const settingState = this.getSettings();
    this.handleThemeChange(settingState.theme);
  }
  
  getSettings() {
    return JSON.parse(localStorage.getItem('settingState')) || this.default;
  }
  
  saveSettings(object) {
    const settingsState = this.getSettings();
    const updated = Object.assign({}, settingsState, object);
    localStorage.setItem('settingState', JSON.stringify(updated));
  }
  
  handleThemeChange(theme) {
    document.body.className = theme;
    this.saveSettings({ theme });
  }

  render() {
    
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
              this.themes.map(item => (
                <button type="button"
                        role="menuitem"
                        className="button"
                        onClick={() => this.handleThemeChange(item.class)}
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
  
}

export default AppSettings
