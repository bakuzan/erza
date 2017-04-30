import React, { Component, PropTypes } from 'react'
import {Enums, Icons} from '../../constants/values'
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
    if (activeSuggestion) return this.selectTypeaheadEntry(activeSuggestion._id);

    const alreadyExists = this.props.list.find(x => x.name === this.state.text);
    if (alreadyExists) return;

    this.updateList({ name: this.state.text });
    this.setState({ text: '' });
  }

  selectTypeaheadEntry(id) {
    const item = this.props.typeahead.find(x => x._id === id);
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
      const item = this.props.list.find(y => y._id === x._id);
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

  highlightMatch(value) {
    const match = value.match(this.state.text);
    if (!match) return value;

    const length = this.state.text.length;
    return (
      <span>
        { value.slice(0, match.index) }
        <span className="highlight">
          { value.slice(match.index, match.index + length) }
        </span>
        { value.slice(match.index + length) }
      </span>
    );
  }

  handleText(event) {
    this.setState({ text: event.target.value.toLowerCase(), readyRemoval: false, activeSuggestion: 0 })
  }

  handleKeyDown(event) {
    const { keyCode } = event;
    if (keyCode === Enums.keyCode.enter && this.state.text) {
      event.preventDefault();
      this.addInputItem();
    } else if (keyCode === Enums.keyCode.backspace && !this.state.text) {
      if (!this.state.readyRemoval) return this.setStateRemoval(true);
      if (this.state.readyRemoval) return this.removeLastInputItem();
    } else if (keyCode === Enums.keyCode.down) {
      this.updateActiveSuggestion(1);
    } else if (keyCode === Enums.keyCode.up) {
      this.updateActiveSuggestion(-1);
    }
  }

  render() {
    const { name, label, placeholder, list } = this.props;
    // console.log('%c input list => ', 'font-weight: bold; font-size: 18px', list);
    const inputList = list.filter(x => x !== undefined).map((item, index, array) => {
      const readyRemoval = this.state.readyRemoval && index === array.length - 1;
      return (
        <span key={index} className={`input-chip input-chip-deletable${readyRemoval ? ' active' : ''}`}>
          <span className="input-chip-text">{ item.name }</span>
          <button type="button"
                  className="button-icon small input-chip-delete"
                  title="remove"
                  icon={Icons.cross}
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
                  const activeSuggestion = this.state.activeSuggestion === index ? ' active' : '';
                  return (
                    <li key={item._id}
                      className={`autocomplete-suggestion${activeSuggestion}`}>
                      <button type="button"
                        className="button ripple"
                        onClick={() => this.selectTypeaheadEntry(item._id)}>
                        { this.highlightMatch(item.name) }
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
