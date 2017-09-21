import React, {Component} from 'react'
import PropTypes from 'prop-types'
import ClearableInput from '../clearable-input/clearable-input'
import {Enums} from '../../constants/values'
import {isNumber} from '../../utils/common'
import './autocomplete-input.css'

class AutocompleteInput extends Component {

  constructor() {
    super();
    this.state = {
      activeSuggestion: 0
    };

    this.handleInputFilter = this.handleInputFilter.bind(this)
    this.handleKeyDown = this.handleKeyDown.bind(this)
  }

  selectAutocompleteSuggestion(id) {
    if (!id && id !== 0 && !this.props.noSuggestionsItem) return;
    this.props.onSelect(id);
  }

  selectActiveSuggestion() {
    const item = this.filterAutoComplete()[this.state.activeSuggestion];
    const id = !!item
      ? isNumber(item.id)
        ? item.id
        : item._id
      : null;
    this.selectAutocompleteSuggestion(id);
  }

  filterAutoComplete() {
    const { items, attr, filter, disableLocalFilter } = this.props;
    if (!(items && filter)) return [];
    if (disableLocalFilter) return items;

    const filterLowerCase = filter.toLowerCase();
    return items.filter(x => x[attr].toLowerCase().indexOf(filterLowerCase) > -1);
  }

  updateActiveSuggestion(value) {
    const maxIndex = this.filterAutoComplete().length - 1;
    let newValue = this.state.activeSuggestion + value;
    if (newValue > maxIndex) newValue = 0;
    if (newValue < 0) newValue = maxIndex;
    this.setState({ activeSuggestion: newValue });
  }

  highlightMatch(value) {
    const match = value.match(new RegExp(this.props.filter, 'i'));
    if (!match) return value;

    const length = this.props.filter.length;
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

  handleInputFilter(event) {
    this.props.onChange(event);
    this.setState({ activeSuggestion: 0 });
  }

  handleKeyDown(event) {
    const { keyCode } = event;
    if (keyCode === Enums.keyCode.enter && this.props.filter) {
      event.preventDefault();
      this.selectActiveSuggestion();
    } else if (keyCode === Enums.keyCode.down) {
      this.updateActiveSuggestion(1);
    } else if (keyCode === Enums.keyCode.up) {
      this.updateActiveSuggestion(-1);
    } else if (this.props.onKeyDown) {
      this.props.onKeyDown(event);
    }
  }

  render() {
    const { filter, attr, label, noSuggestionsItem } = this.props;
    const autocomplete = this.filterAutoComplete();
    const hasOptions = !!this.props.items.length;
    const hasSuggestions = !!autocomplete.length;
    
    return (
      <div className="autocomplete">
        <ClearableInput
          label={label}
          name={attr}
          value={filter}
          onChange={this.handleInputFilter}
          onKeyDown={this.handleKeyDown}
        />
        {
          !!filter &&
          <ul className="autocomplete-menu list column one">
            {
              hasSuggestions &&
              autocomplete.map((item, index) => {
                const itemId = isNumber(item.id)
                                ? item.id
                                : item._id;
                const activeSuggestion = this.state.activeSuggestion === index ? ' active' : '';
                return (
                  <li
                    key={itemId}
                    className={`autocomplete-suggestion${activeSuggestion}`}>
                    <button
                      type="button"
                      className="button ripple"
                      title={item[attr]}
                      onClick={() => this.selectAutocompleteSuggestion(itemId)}>
                      { this.highlightMatch(item[attr]) }
                    </button>
                  </li>
                );
              })
            }
            {
              !hasSuggestions && hasOptions &&
              <li id="no-suggestions-item" className="autocomplete-suggestion active">
                {
                  !!noSuggestionsItem 
                    ? noSuggestionsItem
                    : <div>No suggestions available</div>
                }
               </li>
            }
          </ul>
        }
      </div>
    );
  }
}

AutocompleteInput.defaultProps = {
  disableLocalFilter: false,
  noSuggestionsItem: null
}

AutocompleteInput.propTypes = {
  label: PropTypes.string,
  attr: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  filter: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  onKeyDown: PropTypes.func,
  disableLocalFilter: PropTypes.bool
}

export default AutocompleteInput
