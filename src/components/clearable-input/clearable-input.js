import React from 'react'
import PropTypes from 'prop-types'
import {Icons} from '../../constants/values'
import './clearable-input.css'

const ClearableInput = ({ name = "search", search, onChange, onKeyDown }) => (
  <div className="has-float-label input-container clearable-input">
    <input
      type="text"
      name={name}
      placeholder=" "
      value={search}
      onChange={onChange}
      onKeyDown={onKeyDown}
      autoComplete="off"
      />
    <label>search</label>
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
  </div>
);

ClearableInput.propTypes = {
  name: PropTypes.string,
  search: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onKeyDown: PropTypes.func
}

export default ClearableInput
