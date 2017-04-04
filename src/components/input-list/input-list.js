import React, { Component, PropTypes } from 'react'
import {Enums} from '../../constants/values'
import './input-list.css'

class InputList extends Component {

  constructor() {
    super();
    this.state = {
      text: '',
      readyRemoval: false,
      activeSuggestion: 0
    };

  }

  persistListState(list) {
    this.props.updateList(this.props.name, list);
    this.setStateRemoval(false);
  }

  updateList(item) {
    const list = [...this.props.list, item];
    this.persistListState(list);
  }

  addInputItem() {
    const autoCompleteList = this.filterAutoComplete();
    const activeSuggestion = autoCompleteList[this.state.activeSuggestion];
    if (activeSuggestion) return this.selectTypeaheadEntry(activeSuggestion.id);

    const alreadyExists = this.props.list.find(x => x.name === this.state.text);
    if (alreadyExists) return;

    this.updateList({ name: this.state.text });
    this.setState({ text: '' });
  }

  selectTypeaheadEntry(id) {
    const item = this.props.typeahead.find(x => x.id === id);
    this.updateList(item);
    this.setState({ text: '' });
  }

  removeInputItem(name) {
    const list = this.props.list.filter(x => x.name !== name);
    this.persistListState(list);
  }

  removeLastInputItem() {
    const list = this.props.list.slice(0, this.props.list.length - 1);
    this.persistListState(list);
  }

  setStateRemoval(value) {
    this.setState({ readyRemoval: value });
  }

  filterAutoComplete() {
    if (!(this.props.typeahead && this.state.text)) return Array(0);
    return this.props.typeahead.filter(x => {
      const item = this.props.list.find(y => y.id === x.id);
      return !item && x.name.indexOf(this.state.text) > -1;
    });
  }

  updateActiveSuggestion(value) {
    const maxIndex = this.filterAutoComplete().length - 1;
    let newValue = this.state.activeSuggestion + value;
    if (newValue > maxIndex) newValue = 0;
    if (newValue < 0) newValue = maxIndex;
    this.setState({ activeSuggestion: newValue });
  }

  handleText(event) {
    this.setState({ text: event.target.value.toLowerCase(), readyRemoval: false, activeSuggestion: 0 })
  }

  handleKeyDown(event) {
    const { keyCode } = event;
    if (keyCode === Enums.keyCode.enter && this.state.text) {
      event.preventDefault();
      this.addInputItem();
    } else if (keyCode === 8 && !this.state.text) { //backspace
      if (!this.state.readyRemoval) return this.setStateRemoval(true);
      if (this.state.readyRemoval) return this.removeLastInputItem();
    } else if (keyCode === 40) { //down
      this.updateActiveSuggestion(1);
    } else if (keyCode === 38) { //up
      this.updateActiveSuggestion(-1);
    }
  }

  render() {
    const { name, label, placeholder, list, typeahead } = this.props;
    console.log('render => ', name, label, placeholder, list, typeahead);
    const inputList = list.map((item, index, array) => {
      const readyRemoval = this.state.readyRemoval && index === array.length - 1;
      return (
        <span key={index} className={`input-chip input-chip-deletable${readyRemoval ? ' active' : ''}`}>
          <span className="input-chip-text">{ item.name }</span>
          <button type="button"
                  className="button-icon small input-chip-delete"
                  title="remove"
                  icon="&#10060;"
                  onClick={() => this.removeInputItem(item.name)}
            ></button>
        </span>
      );
    });
    const autoCompleteList = this.filterAutoComplete();
    const hasInputs = inputList.length > 0;
    const hasAutoComplete = autoCompleteList.length > 0;

    return (
      <div className="input-list-container has-float-label input-container">
        <div className="input-list-wrapper">
          <input
            className="flex-all"
            type="text"
            name={name}
            value={this.state.text}
            placeholder={placeholder}
            onChange={(e) => this.handleText(e)}
            onKeyDown={(e) => this.handleKeyDown(e)}
            />
          <label className={`${hasInputs ? 'input-has-content' : ''}`}>
            { label }
          </label>
          {
            hasInputs &&
            <div className="list">
              { inputList }
            </div>
          }
        </div>
        {
          hasAutoComplete &&
            <ul className="autocomplete-menu">
              {
                autoCompleteList.map((item, index) => {
                  const activeSuggestion = this.state.activeSuggestion === index ? ' primary' : '';
                  return (
                    <li key={item.id}
                      className="autocomplete-suggestion">
                      <button type="button"
                        className={`button ripple${activeSuggestion}`}
                        onClick={() => this.selectTypeaheadEntry(item.id)}>
                        { item.name }
                      </button>
                    </li>
                  );
                })
              }
            </ul>
        }
      </div>
    );
  }
}
InputList.defaultProps = {
  label: 'input list',
  placeholder: 'enter input'
}

InputList.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  list: PropTypes.arrayOf(PropTypes.object).isRequired,
  typeahead: PropTypes.arrayOf(PropTypes.object)
}

export default InputList;
