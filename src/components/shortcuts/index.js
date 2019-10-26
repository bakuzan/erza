import classNames from 'classnames';
import React, { Component } from 'react';

import AutocompleteInput from 'meiko/AutocompleteInput';
import Dialog from 'meiko/Dialog';

import { Enums } from 'constants/values';
import Menu from 'constants/menu';
import { createListeners } from 'utils';

import './Shortcuts.scss';

const shortcut = (o) => ({ ctrlKey, keyCode }) =>
  ctrlKey && keyCode === Enums.KeyCodes.q ? o.toggleVisible() : null;

class Shortcuts extends Component {
  constructor() {
    super();
    this.state = {
      items: Menu.reduce((p, c) => p.concat(c.children), Array(0)),
      filter: '',
      isOpen: false,
      useOpenClass: false
    };

    this.controller = null;
    this.timer = null;
    this.classTimer = null;
    this.toggleVisible = this.toggleVisible.bind(this);
    this.handleFilter = this.handleFilter.bind(this);
    this.performAction = this.performAction.bind(this);
  }

  componentDidMount() {
    this.controller = createListeners('keydown', shortcut(this))();
    this.controller.listen();
  }

  componentDidUpdate(_, prevState) {
    if (this.state.isOpen && !prevState.isOpen) {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        const inp = document.getElementById('shortcuts');

        if (inp) {
          inp.focus();
        }
      }, 333);
    }
  }

  componentWillUnmount() {
    this.controller.remove();
    clearTimeout(this.timer);
    clearTimeout(this.classTimer);
  }

  toggleVisible(withCallback = true) {
    clearTimeout(this.classTimer);

    this.setState(
      (p) => ({
        filter: '',
        isOpen: withCallback ? true : !p.useOpenClass,
        useOpenClass: !p.useOpenClass
      }),
      () => {
        if (withCallback && !this.state.useOpenClass) {
          this.classTimer = setTimeout(
            () => this.setState({ isOpen: false }),
            400
          );
        }
      }
    );
  }

  handleFilter(event) {
    this.setState({ filter: event.target.value });
  }

  performAction(id) {
    const { link, action } = this.state.items.find((x) => x.id === id);
    this.toggleVisible(false);

    if (!!link) {
      return this.props.history.push(link);
    }

    return action();
  }

  render() {
    const { isOpen, useOpenClass } = this.state;

    return (
      <Dialog
        className={classNames('shortcuts-dialog', {
          'shortcuts-dialog--open': useOpenClass
        })}
        name="shortcuts"
        isOpen={isOpen}
        isForm={false}
        hasBackdrop={false}
        hideCancel={true}
        onCancel={() => this.toggleVisible()}
        tabTrapProps={{ firstId: 'shortcuts', lastId: 'shortcuts' }}
        aria-hidden={!isOpen}
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
    );
  }
}

export default Shortcuts;
