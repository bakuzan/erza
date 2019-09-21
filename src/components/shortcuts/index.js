import React, { Component } from 'react';

import { AutocompleteInput, Dialog } from 'mko';

import { Enums } from 'constants/values';
import Menu from 'constants/menu';
import { createListeners } from 'utils';

import './Shortcuts.scss';

const shortcut = (o) => ({ ctrlKey, keyCode }) =>
  ctrlKey && keyCode === Enums.KeyCodes.q ? o.toggleVisible() : null;

const sharedStyle = { transition: 'all 0.33s ease-in-out', zIndex: 100 };

const VISIBLE = {
  container: { opacity: 1, visibility: 'visible' },
  dialog: {}
};

const HIDDEN = {
  container: {
    visibility: 'hidden',
    pointerEvents: 'none',
    opacity: 0
  },
  dialog: { marginTop: 30 }
};

class Shortcuts extends Component {
  constructor() {
    super();
    this.state = {
      items: Menu.reduce((p, c) => p.concat(c.children), Array(0)),
      filter: '',
      isOpen: false
    };

    this.controller = null;
    this.handleFilter = this.handleFilter.bind(this);
    this.performAction = this.performAction.bind(this);
  }

  componentDidMount() {
    this.controller = createListeners('keydown', shortcut(this))();
    this.controller.listen();
  }

  componentWillUnmount() {
    this.controller.remove();
  }

  toggleVisible() {
    this.setState((p) => ({ filter: '', isOpen: !p.isOpen }));
  }

  handleFilter(event) {
    this.setState({ filter: event.target.value });
  }

  performAction(id) {
    const { link, action } = this.state.items.find((x) => x.id === id);
    this.toggleVisible();

    if (!!link) {
      return this.props.history.push(link);
    }

    return action();
  }

  render() {
    const styles = this.state.isOpen ? VISIBLE : HIDDEN;

    return (
      <div
        id="shortcuts-container"
        aria-hidden={!this.state.isOpen}
        style={{ ...sharedStyle, ...styles.container }}
      >
        <Dialog
          name="shortcuts"
          style={{ ...sharedStyle, ...styles.dialog }}
          isOpen={this.state.isOpen}
          isForm={false}
          hasBackdrop={false}
          hideCancel={true}
          onCancel={() => this.setState({ isOpen: false })}
          tabTrapProps={{ firstId: 'shortcuts', lastId: 'shortcuts' }}
        >
          <AutocompleteInput
            autoFocus
            menuClassName="erza-autocomplete-menu"
            id="shortcuts"
            attr="title"
            label="Search for a page..."
            items={this.state.items}
            filter={this.state.filter}
            onChange={this.handleFilter}
            onSelect={this.performAction}
          />
        </Dialog>
      </div>
    );
  }
}

export default Shortcuts;
