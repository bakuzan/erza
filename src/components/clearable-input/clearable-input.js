import React from 'react'
import PropTypes from 'prop-types'
import {Icons} from '../../constants/values'
import './clearable-input.css'

const ClearableInput = ({ name = "search", label, search, maxLength, onChange, onKeyDown }) => (
  <div className="has-float-label input-container clearable-input">
    <input
      type="text"
      name={name}
      placeholder=" "
      maxLength={maxLength}
      value={search}
      onChange={onChange}
      onKeyDown={onKeyDown}
      autoComplete="off"
      />
    <label>{ label || 'search' }</label>
    {
      !!search &&
      <button
        type="button"
        className="button-icon small clear-input"
        icon={Icons.cross}
        onClick={() => onChange({ target: { name, value: '' } })}
        >
      </button>
    }
    {
      !!maxLength &&
      <span className="input-length-count">
      { `${search.length}/${maxLength}` }
      </span>
    }
  </div>
);

ClearableInput.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  search: PropTypes.string.isRequired,
  maxLength: PropTypes.number,
  onChange: PropTypes.func.isRequired,
  onKeyDown: PropTypes.func
}

export default ClearableInput
