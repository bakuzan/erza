import React, { Component } from 'react'
import TabView from '../tab-view/tab-view'
import './tab-container.css'

class TabContainer extends Component {
  constructor() {
    super();
    this.state = {
      activeTab: null
    };

  }
  componentDidMount() {
    if (this.state.activeTab || !this.props.children) return;
    const child = this.props.children[0].props;
    this.setState({ activeTab: child.name });
  }
  handleTabChange(tabName) {
    this.setState({ activeTab: tabName });
  }
  renderViews(tabs) {
    return tabs.map(item => {
      const name = item.props.name;
      const props = Object.assign({}, { ...item.props, isActive: name === this.state.activeTab });

      return (
        <TabView key={name} {...props} />
      );
    });
  }
  renderControls(tabs) {
    return tabs.map(item => {
      const name = item.props.name;
      const isActive = name === this.state.activeTab ? 'active' : '';

      return (
        <li key={name} className={isActive} role="tab">
          <button type="button" className="button" onClick={() => this.handleTabChange(name)}>
            { name }
          </button>
        </li>
      );
    });
  }
  render() {
    const children = this.props.children;
    const tabControls = this.renderControls(children);
    const tabViews = this.renderViews(children);

    return (
      <div className="tab-container">
        <ul className="tab-controls row" role="tablist">
          { tabControls }
        </ul>
        <div className="tabs">
          { tabViews }
        </div>
      </div>
    );
  }
}

TabContainer.propTypes = {
  children: React.PropTypes.arrayOf(function(propValue, key, componentName, location, propFullName) {
    propValue.forEach(item => {
      if (!item.type || !item.type.name || item.type.name !== 'TabView') {
        return new Error(`TabContainer propTypes: Invalid prop '${propFullName}' supplied to ${componentName}. Validation failed.`);
      }
    });
  }).isRequired
};

export default TabContainer
