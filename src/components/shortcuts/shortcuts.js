import React, {Component} from 'react'
import { browserHistory } from 'react-router'
import Dialog from '../dialog/dialog'
import AutocompleteInput from '../autocomplete-input/autocomplete-input'

import {Enums} from '../../constants/values'
import Menu from '../../constants/menu'

const shortcut = o => ({ctrlKey,keyCode}) => (ctrlKey && keyCode === Enums.keyCode.q) ? o.toggleVisible() : null;
const createListeners = f => ({
  listen: () => document.body.addEventListener('keydown', f),
  remove: () => document.body.removeEventListener('keydown', f)
})

class Shortcuts extends Component {

  constructor() {
    super();
    this.state = {
      filter: ''
    }
    this.items = Menu.reduce((p, c) => p.concat(c.children) , Array(0))
    this.controller = createListeners(shortcut(this));

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
    if (!!link) return browserHistory.push(link);
    return action();
  }

  render() {
    return (
      <Dialog name="shortcuts" getDialogRef={this.assignRef}>
        <AutocompleteInput
          attr="title"
          items={this.items}
          filter={this.state.filter}
          onChange={this.handleFilter}
          onSelect={this.performAction}
          />
      </Dialog>
    );
  }
}

export default Shortcuts
