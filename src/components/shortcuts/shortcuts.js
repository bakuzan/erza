import React, { Component } from 'react';

import { AutocompleteInput, Dialog } from 'meiko';

import { Enums } from '../../constants/values';
import Menu from '../../constants/menu';
import { createListeners } from '../../utils/common';

import './shortcuts.css';

const shortcut = o => ({ ctrlKey, keyCode }) =>
  ctrlKey && keyCode === Enums.keyCodes.q ? o.toggleVisible() : null;

class Shortcuts extends Component {
  constructor() {
    super();
    this.state = {
      filter: ''
    };
    this.items = Menu.reduce((p, c) => p.concat(c.children), Array(0));
    this.controller = createListeners('keydown', shortcut(this))();

    this.assignRef = this.assignRef.bind(this);
    this.handleFilter = this.handleFilter.bind(this);
    this.performAction = this.performAction.bind(this);
  }

  componentDidMount() {
    this.controller.listen();
  }

  componentWillUnmount() {
    this.controller.remove();
  }

  toggleVisible() {
    this.dialog.open ? this.dialog.close() : this.dialog.showModal();
    this.setState({ filter: '' });
  }

  assignRef(el) {
    this.dialog = el;
  }

  handleFilter(event) {
    this.setState({ filter: event.target.value });
  }

  performAction(id) {
    const { link, action } = this.items.find(x => x.id === id);
    this.toggleVisible();
    if (!!link) return this.props.history.push(link);
    return action();
  }

  render() {
    return (
      <div id="shortcuts-container">
        <Dialog
          name="shortcuts"
          isForm={false}
          hideCancel={true}
          hasBackdrop={false}
          getDialogRef={this.assignRef}
        >
          <AutocompleteInput
            attr="title"
            items={this.items}
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
