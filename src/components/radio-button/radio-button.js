import React, {PropTypes} from 'react'
import './radio-button.css'

const RadioButton = ({ name, label, value, checked, onSelect }) = (
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

export default RadioButton
