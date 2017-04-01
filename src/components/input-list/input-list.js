import React, { Component, PropTypes } from 'react'
import './input-list.css'

class InputList extends Component {

  constructor() {
    super();
    this.state = {
      text: '',
      readyRemoval: false
    };

  }

  updateList(list) {
    this.props.updateList(this.props.name, list);
    this.setStateRemoval(false);
  }

  addInputItem() {
    const alreadyExists = this.props.list.find(x => x.name === this.state.text);
    if (alreadyExists) return;

    const list = [...this.props.list, { name: this.state.text }];
    this.updateList(list);
    this.setState({ text: '' });
  }

  removeInputItem(name) {
    const list = this.props.list.filter(x => x.name !== name);
    this.updateList(list);
  }

  removeLastInputItem() {
    const list = this.props.list.slice(0, this.props.list.length - 1);
    this.updateList(list);
  }

  setStateRemoval(value) {
    this.setState({ readyRemoval: value });
  }

  handleText(event) {
    this.setState({ text: event.target.value.toLowerCase(), readyRemoval: false })
  }

  handleKeyDown(event) {
    const { keyCode } = event;
    if (keyCode === 13 && this.state.text) {
      event.preventDefault();
      this.addInputItem();
    } else if (keyCode === 8 && !this.state.text) {
      if (!this.state.readyRemoval) return this.setStateRemoval(true);
      if (this.state.readyRemoval) return this.removeLastInputItem();
    }
  }

  render() {
    const { name, label, placeholder, list } = this.props;
    const inputList = list.map((item, index, array) => {
      const readyRemoval = this.state.readyRemoval && index === array.length - 1;
      return (
        <span key={index} className={`input-chip input-chip-deltable${readyRemoval ? ' active' : ''}`}>
          <span className="input-chip-text">{ item.name }</span>
          <button type="button"
                  className="input-chip-delete button-icon small"
                  title="remove"
                  icon="&#10060;"
                  onClick={() => this.removeInputItem(item.name)}
            ></button>
        </span>
      );
    });
    const hasInputs = inputList.length > 0;

    return (
      <div className="input-list-container has-float-label input-container">
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
  list: PropTypes.arrayOf(PropTypes.object).isRequired
}

export default InputList;
