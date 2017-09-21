import React from 'react'
import PropTypes from 'prop-types'
import {Icons} from '../../constants/values'
import {debounce} from '../../utils/common'
import './clearable-input.css'

let inputField;
const clearAndFocusInput = (name, clearInput) => () => {
  clearInput({ target: { name, value: '' } });
  debounce(() => inputField.focus(), 100);
}

const ClearableInput = ({ name = "search", label = "search", value, maxLength, onChange, onKeyDown, ...otherProps }) => (
  <div className="has-float-label input-container clearable-input">
    <input
      ref={(input) => inputField = input}
      type="text"
      name={name}
      placeholder=" "
      maxLength={maxLength}
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      autoComplete="off"
      {...otherProps}
      />
    <label>{ label }</label>
    {
      !!value &&
      <button
        type="button"
        className="button-icon small clear-input"
        icon={Icons.cross}
        onClick={clearAndFocusInput(name, onChange)}
        >
      </button>
    }
    {
      !!maxLength &&
      <span className="clearable-input-count">
      { `${value.length}/${maxLength}` }
      </span>
    }
  </div>
);

ClearableInput.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.string.isRequired,
  maxLength: PropTypes.number,
  onChange: PropTypes.func.isRequired,
  onKeyDown: PropTypes.func
}

export default ClearableInput
