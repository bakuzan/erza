import React, {PropTypes} from 'react'
import './radio-button.css'

const RadioButton = ({ name, label, value, checked, onSelect }) => (
  <label
    className="radio"
    role="radio"
    >
    <input
      type="radio"
      name={name}
      value={value}
      checked={checked}
      onChange={(e) => onSelect(e)}
      />
    <span>{ label }</span>
  </label>
)

RadioButton.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
    PropTypes.number
  ]).isRequired,
  checked: PropTypes.bool.isRequired,
  onSelect: PropTypes.func.isRequired
}

export default RadioButton
